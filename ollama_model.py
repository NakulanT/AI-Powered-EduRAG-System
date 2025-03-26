import requests
import json
import re
from Rag import retrieve_chunks  # Import from your existing rag.py

# Ollama API endpoint (assuming it's running locally)
OLLAMA_API_URL = "http://localhost:11434/api/generate"

def query_ollama(prompt, model="deepseek-r1:1.5b"):
    try:
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False
        }
        response = requests.post(OLLAMA_API_URL, json=payload)
        response.raise_for_status()
        result = response.json()
        return result["response"]
    except requests.exceptions.RequestException as e:
        print(f"Error querying Ollama model: {e}")
        return None

def generate_answer(query, top_k=3):
    print(f"Retrieving chunks for query: '{query}'...")
    chunks = retrieve_chunks(query, top_k=top_k)
    
    if not chunks:
        return "No relevant information found to answer your query."

    context = "\n\n".join([chunk["text"] for chunk in chunks])
    print("Retrieved context:")
    print(context)

    prompt = f"""Given the following context and user query, provide a concise and accurate answer.

Context:
{context}

Query: {query}

Answer:"""
    
    print(f"Sending prompt to Ollama model: {prompt[:200]}...")
    raw_answer = query_ollama(prompt)
    if raw_answer:
        # Strip out <think>...</think> block if present
        clean_answer = re.sub(r'<think>.*?</think>\s*', '', raw_answer, flags=re.DOTALL)
        print(f"Generated answer: {clean_answer}")
        return clean_answer.strip()
    else:
        return "Failed to generate an answer due to model error."

def main():
    # Example usage
    user_query = input("Enter your query: ")
    answer = generate_answer(user_query)
    print("\nFinal Answer:")
    print(answer)

if __name__ == "__main__":
    main()