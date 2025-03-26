import nltk
import spacy
import tiktoken
from nltk.tokenize import sent_tokenize
import chromadb
from sentence_transformers import SentenceTransformer
from chromadb.api.types import EmbeddingFunction
import traceback
from time import time
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

nltk.download('punkt')
nltk.download('punkt_tab')

logger.info("Loading SpaCy model...")
nlp = spacy.load("en_core_web_sm")
logger.info("SpaCy model loaded.")

logger.info("Initializing tiktoken...")
enc = tiktoken.get_encoding("cl100k_base")
logger.info("Tiktoken initialized.")

logger.info("Loading SentenceTransformer model...")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
logger.info("SentenceTransformer model loaded.")

class SentenceTransformerEmbeddingFunction(EmbeddingFunction):
    def __call__(self, input):
        return embedding_model.encode(input).tolist()

logger.info("Initializing ChromaDB client...")
persist_path = "./chroma_db"
chroma_client = chromadb.PersistentClient(path=persist_path)
# For testing, optionally switch to in-memory client to avoid persistent storage issues
# chroma_client = chromadb.Client()
collection_name = "rag_chunks"

try:
    collection = chroma_client.get_collection(name=collection_name )
    logger.info(f"Using existing collection '{collection_name}'.")
except:
    logger.info(f"No existing collection '{collection_name}', creating new one...")
    embedding_function = SentenceTransformerEmbeddingFunction()
    collection = chroma_client.create_collection(
        name=collection_name,
        embedding_function=embedding_function,
        metadata={"hnsw:batch_size":10000}
    )
    logger.info("ChromaDB collection created.")
else:
    embedding_function = SentenceTransformerEmbeddingFunction()

def extract_keywords(text, top_n=5):
    doc = nlp(text)
    keywords = []
    for token in doc:
        if token.pos_ in ("NOUN", "PROPN") or (token.pos_ == "VERB" and token.dep_ in ("ROOT", "xcomp")):
            keywords.append(token.text.lower())
    keywords = list(dict.fromkeys(keywords))[:top_n]
    return keywords

def store_dataset(raw_text, max_sentences=3, max_tokens=100, bypass_storage=False):
    logger.debug(f"Received dataset: {raw_text[:100]}...")
    
    chunks = []
    current_chunk = []
    current_token_count = 0
    chunk_id = collection.count()

    sentences = sent_tokenize(raw_text)
    logger.debug(f"Text split into {len(sentences)} sentences.")

    for i, sentence in enumerate(sentences):
        sentence_tokens = len(enc.encode(sentence))
        logger.debug(f"Sentence {i+1}: '{sentence}' ({sentence_tokens} tokens)")
        if (len(current_chunk) < max_sentences and 
            current_token_count + sentence_tokens <= max_tokens):
            current_chunk.append(sentence)
            current_token_count += sentence_tokens
        else:
            if current_chunk:
                chunk_text = " ".join(current_chunk)
                chunk_id_str = f"chunk_{chunk_id}_{int(time()*1000)}"
                chunk_data = {
                    "text": chunk_text,
                    "token_count": current_token_count,
                    "keywords": extract_keywords(chunk_text)
                }
                chunks.append(chunk_data)
                logger.debug(f"Storing chunk {chunk_id_str} with {current_token_count} tokens: '{chunk_text}'")
                if not bypass_storage:
                    try:
                        collection.upsert(
                            documents=[chunk_text],
                            metadatas=[{"keywords": ", ".join(chunk_data["keywords"]), "token_count": str(current_token_count)}],
                            ids=[chunk_id_str]
                        )
                        logger.debug(f"Chunk {chunk_id_str} stored successfully.")
                    except Exception as e:
                        logger.error(f"Error storing chunk {chunk_id_str}: {e}")
                        traceback.print_exc()
                else:
                    logger.debug(f"Bypassing storage for chunk {chunk_id_str}")
                chunk_id += 1
            current_chunk = [sentence]
            current_token_count = sentence_tokens

    if current_chunk:
        chunk_text = " ".join(current_chunk)
        chunk_id_str = f"chunk_{chunk_id}_{int(time()*1000)}"
        chunk_data = {
            "text": chunk_text,
            "token_count": current_token_count,
            "keywords": extract_keywords(chunk_text)
        }
        chunks.append(chunk_data)
        logger.debug(f"Storing final chunk {chunk_id_str} with {current_token_count} tokens: '{chunk_text}'")
        if not bypass_storage:
            try:
                collection.upsert(
                    documents=[chunk_text],
                    metadatas=[{"keywords": ", ".join(chunk_data["keywords"]), "token_count": str(current_token_count)}],
                    ids=[chunk_id_str]
                )
                logger.debug(f"Chunk {chunk_id_str} stored successfully.")
            except Exception as e:
                logger.error(f"Error storing chunk {chunk_id_str}: {e}")
                traceback.print_exc()
        else:
            logger.debug(f"Bypassing storage for chunk {chunk_id_str}")
    
    logger.debug(f"Chunking and storage completed. Total chunks: {len(chunks)}")
    return chunks

def retrieve_chunks(query, top_k=3):
    logger.debug(f"Retrieving chunks for query: '{query}'...")
    try:
        query_embedding = embedding_function([query])[0]
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )
        retrieved_chunks = []
        for doc, metadata, dist in zip(results['documents'][0], results['metadatas'][0], results['distances'][0]):
            chunk_info = {
                "text": doc,
                "keywords": metadata["keywords"].split(", "),
                "token_count": int(metadata["token_count"]),
                "distance": float(dist)
            }
            retrieved_chunks.append(chunk_info)
            logger.debug(f"Retrieved Chunk (Distance: {dist:.4f}):")
            logger.debug(f"Text: {doc}")
            logger.debug(f"Keywords: {metadata['keywords']}")
            logger.debug(f"Token Count: {metadata['token_count']}\n")
        logger.debug("Retrieval completed.")
        return retrieved_chunks
    except Exception as e:
        logger.error(f"Error in retrieve_chunks: {e}")
        traceback.print_exc()
        return []