import base64
import os
from google import genai
from google.genai import types
import json

class Question_API:
    def generate(self,json_input):
        print("Generating questions...")
        client = genai.Client(
            api_key= "AIzaSyAGxVGv47iftk59wxDTDEzxrJtT_ChTOoc" ,
        )

        model = "gemini-2.0-flash"
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(
                        text="""Crete question for the topics using blooms taxonmy

    i will give input in josn format

    eg: [
    subject Name : \"data structres\"
tpoics : [\"array\" , \"queue\" , \"linked list\"],
short answer : 5
medium answer : 2
long answer :  5
]

The output should be like :

{
\"short\": [
\"How do you declare an array in Python?\",
\"What is a stack in data structures?\",
\"Explain the concept of a queue.\",
\"What is the difference between a linear and non-linear data structure?\",
\"What is the time complexity of searching in a binary search tree?\"
],
\"medium\": [
\"How does a linked list differ from an array?\",
\"Explain the working of a hash table with an example.\"
],
\"long\": [
\"Describe different types of trees in data structures and their use cases.\",
\"How does the QuickSort algorithm work? Explain with an example.\",
\"What are the different types of linked lists, and how do they work?\",
\"Explain the concept of graph traversal and compare BFS and DFS.\",
\"What is dynamic programming, and how does it differ from recursion?\"
]
}


So , here after when i give input format , craete questions on the topics as per the requireed rate and return in json format
, here is my input (Dont give code)

{
  \"subject_name\": \"Object-Oriented Programming\",
  \"topics\": [\"Classes and Objects\", \"Inheritance\", \"Polymorphism\", \"Encapsulation\", \"Abstraction\"],
  \"short_answer\": 5,
  \"medium_answer\": 3,
  \"long_answer\": 4
}
"""),
            ],
        ),
        types.Content(
            role="model",
            parts=[
                types.Part.from_text(text="""Okay, I understand. Based on your input:

```json
{
  \"subject_name\": \"Object-Oriented Programming\",
  \"topics\": [\"Classes and Objects\", \"Inheritance\", \"Polymorphism\", \"Encapsulation\", \"Abstraction\"],
  \"short_answer\": 5,
  \"medium_answer\": 3,
  \"long_answer\": 4
}
```

Here's the JSON output containing the questions, categorized by answer length:

```json
{
  \"short\": [
    \"What is a class in OOP?\",
    \"Define an object in the context of programming.\",
    \"What is inheritance in object-oriented programming?\",
    \"Explain the concept of encapsulation.\",
    \"What is data abstraction?\"
  ],
  \"medium\": [
    \"Explain the difference between inheritance and polymorphism with a simple example.\",
    \"Describe how encapsulation helps in achieving data hiding.\",
    \"How can abstraction be achieved in programming languages like Java or Python?\"
  ],
  \"long\": [
    \"Explain the concept of polymorphism with examples of method overloading and method overriding.\",
    \"Describe the different types of inheritance and explain their advantages and disadvantages.\",
    \"Explain how encapsulation and abstraction work together to achieve data security and code modularity in object-oriented programming.\",
    \"Design a class diagram for a simple banking system, demonstrating the use of classes, objects, inheritance, and encapsulation.\"
  ]
}
```
"""),
            ],
        ),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""{
  \"subject_name\": \"Computer Networks\",
\"type\" : \"applying\"
  \"topics\": [\"Network Topologies\", \"TCP/IP Model\", \"OSI Model\", \"Routing Algorithms\", \"Network Security\"],
  \"short_answer\": 6,
  \"medium_answer\": 3,
  \"long_answer\": 4
}

In this type like scenario , the question should be based on appying (scenrio) , remember , evaluating , custom(all blooms element)
"""),
            ],
        ),
        types.Content(
            role="model",
            parts=[
                types.Part.from_text(text="""```json
{
  \"short\": [
    \"What is a network topology?\",
    \"Name three common network topologies.\",
    \"What is the purpose of the TCP/IP model?\",
    \"What are the layers of the OSI model?\",
    \"Define a routing algorithm.\",
    \"What is a firewall?\"
  ],
  \"medium\": [
    \"Explain the difference between the TCP/IP model and the OSI model.\",
    \"Describe the function of a router in a network.\",
    \"Explain the concept of subnetting and its benefits.\"
  ],
  \"long\": [
    \"Compare and contrast distance vector routing and link-state routing algorithms.\",
    \"Describe the process of establishing a TCP connection using the three-way handshake.\",
    \"Explain common network security threats and countermeasures.\",
    \"Describe the function of each layer of the OSI model with example protocols.\"
  ]
}
```"""),
            ],
        ),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""give output in json format
"""),
            ],
        ),
        types.Content(
            role="model",
            parts=[
                types.Part.from_text(text="""```json
{
  \"short\": [
    \"What is a network topology?\",
    \"Name three common network topologies.\",
    \"What is the purpose of the TCP/IP model?\",
    \"What are the layers of the OSI model?\",
    \"Define a routing algorithm.\",
    \"What is a firewall?\"
  ],
  \"medium\": [
    \"Explain the difference between the TCP/IP model and the OSI model.\",
    \"Describe the function of a router in a network.\",
    \"Explain the concept of subnetting and its benefits.\"
  ],
  \"long\": [
    \"Compare and contrast distance vector routing and link-state routing algorithms.\",
    \"Describe the process of establishing a TCP connection using the three-way handshake.\",
    \"Explain common network security threats and countermeasures.\",
    \"Describe the function of each layer of the OSI model with example protocols.\"
  ]
}
```"""),
            ],
        ),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""{
  \"subject_name\": \"Computer Networks\",
\"type\" : \"applying\"
  \"topics\": [\"Network Topologies\", \"TCP/IP Model\", \"OSI Model\", \"Routing Algorithms\", \"Network Security\"],
  \"short_answer\": 6,
  \"medium_answer\": 3,
  \"long_answer\": 4
}

In this type like scenario , the question should be based on appying (scenrio) , remember , evaluating , custom(all blooms element)
"""),
            ],
        ),
        types.Content(
            role="model",
            parts=[
                types.Part.from_text(text="""{
  \"short\": [
    \"A small office needs to connect five computers. Which network topology would be the most cost-effective?\",
    \"A user cannot access a website. What is the first step in troubleshooting using the TCP/IP model?\",
    \"An application sends data. Which layer of the OSI model is responsible for ensuring reliable data transfer?\",
    \"Given a network address and subnet mask, determine the number of usable host addresses.\",
    \"A network administrator needs to prevent unauthorized access to the network. What is the first step?\",
    \"Your company's website is being attacked. What type of security threat is this and what steps should you take?\"
  ],
  \"medium\": [
    \"A company is expanding and needs to connect two geographically separate offices. Describe a solution using the TCP/IP model.\",
    \"Compare and contrast two different routing algorithms, considering their suitability for different network sizes.\",
    \"Evaluate the security implications of using different network topologies in a sensitive environment.\"
  ],
  \"long\": [
    \"Design a secure network for a small business, considering different network topologies, security measures, and routing protocols. Justify your choices.\",
    \"A company is experiencing slow network performance. Develop a comprehensive troubleshooting plan based on the OSI model to identify and resolve the issue.\",
    \"Compare and contrast different routing protocols, evaluating their performance under different network conditions (e.g., high traffic, link failures). Propose a suitable routing protocol for a specific scenario.\",
    \"Your company suspects a data breach. Outline a step-by-step plan to investigate the breach, contain the damage, and prevent future incidents, considering different network security tools and techniques.\"
  ]
}"""
                    ),
                ],
            ),
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(
                        text= json_input
                    ),
                ],
            ),
        ]
        generate_content_config = types.GenerateContentConfig(
            temperature=1,
            top_p=0.95,
            top_k=40,
            max_output_tokens=8192,
            response_mime_type="application/json",
        )
        
        # Collect the streamed response
        response_text = ""
        for chunk in client.models.generate_content_stream(model=model, contents=contents, config=generate_content_config):
            response_text += chunk.text

        # Convert response to JSON format
        try:
            response_json = json.loads(response_text)
        except json.JSONDecodeError:
            return {"error": "Invalid JSON response from the API"}

        return response_json  # Returning JSON instead of printing
