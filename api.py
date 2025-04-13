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
class Answer_API:
    def generate(self, json_input):
        print("Generating answers...")
        client = genai.Client(
            api_key= "AIzaSyAGxVGv47iftk59wxDTDEzxrJtT_ChTOoc" ,
        )

        model = "gemini-2.0-flash"
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=""" {
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
  }

  For these questions, give answers in the same JSON format, but instead of questions, provide answers in the same order."""),
                ],
            ),
            types.Content(
                role="model",
                parts=[
                    types.Part.from_text(text="""```json
{
  \"short\": [
    \"A star topology using a central switch is the most cost-effective for a small office connecting five computers. This minimizes cabling costs and simplifies management.\",
    \"Ping the local machine (loopback address 127.0.0.1) to verify the network stack is functioning at the Application layer.\",
    \"The Transport layer of the OSI model is responsible for ensuring reliable data transfer.\",
    \"To determine the number of usable host addresses: 1. Convert the subnet mask to binary. 2. Count the number of 0s in the binary representation (these are the host bits). 3. Calculate 2^(number of host bits) - 2 (subtract 2 for network and broadcast addresses).\",
    \"The first step to prevent unauthorized access is to implement a strong password policy and enable user authentication.\",
    \"This is a Denial-of-Service (DoS) or Distributed Denial-of-Service (DDoS) attack. The steps to take are: 1. Identify the source of the attack. 2. Implement rate limiting and filtering rules on the firewall and router. 3. Contact your ISP for assistance. 4. Monitor network traffic for further suspicious activity.\"
  ],
  \"medium\": [
    \"A company can connect two geographically separate offices using a VPN over the internet. Each office will have a router connected to the internet. A VPN tunnel will be established between the two routers. At the Network layer (IP), the routers will encrypt and encapsulate traffic destined for the remote office before sending it over the public internet. At the Transport layer (TCP/UDP), reliable and connectionless protocols will carry the application data through the encrypted tunnel. Security measures like IPSec will be implemented at the Network layer to ensure data confidentiality and integrity during transmission.\",
    \"Distance Vector routing algorithms (e.g., RIP) use a hop count to determine the best path, and are simple to implement but suffer from slow convergence and the count-to-infinity problem. They are suitable for small networks. Link-State routing algorithms (e.g., OSPF) maintain a complete map of the network topology, allowing for faster convergence and better route selection. They are more complex to implement but are better suited for larger and more complex networks. Link-State are more suitable for larger networks, while Distance Vector are simpler for small networks.\",
    \"In a sensitive environment, a mesh topology offers the highest level of redundancy and fault tolerance, making it difficult for an attacker to disrupt network connectivity. However, it is expensive to implement and maintain. A star topology with strong security measures (firewalls, intrusion detection systems) is more cost-effective but has a single point of failure at the central switch. A ring topology can be fault-tolerant but might have predictable traffic patterns, making it easier for an attacker to intercept data. The choice depends on the specific security requirements and budget constraints.\"
  ],
  \"long\": [
    \"Network design for a small business: \\n\\nTopology: Star topology with a central managed switch for its ease of deployment and management. \\n\\nSecurity: A firewall is essential, placed at the network perimeter to filter incoming and outgoing traffic based on predefined rules. Implement a strong password policy and Multi-Factor Authentication (MFA) for all user accounts. Employ a VPN for secure remote access. Use Intrusion Detection/Prevention System (IDS/IPS) to monitor network traffic for malicious activity.\\n\\nRouting: Static routing can be used for routing to other networks because typically the network will have one path to a gateway (the internet).\\n\\nJustification: Star topology is scalable and easy to manage. Firewall, password policies, VPN, and IDS/IPS are standard security measures. Static routing simplifies network administration because there are no complexities like load balancing.\",
    \"Troubleshooting slow network performance based on the OSI model: \\n\\n1. Physical Layer: Check cabling, connectors, and network interface cards for physical damage or connectivity issues. Verify network card speed and duplex settings. Use a cable tester to check cable integrity.\\n2. Data Link Layer: Check for excessive collisions on the network (if using shared media). Examine switch port statistics for errors. Verify MAC address filtering is configured correctly.\\n3. Network Layer: Ping the gateway and other network devices to check for reachability. Use traceroute to identify routing bottlenecks. Check for IP address conflicts.\\n4. Transport Layer: Use network monitoring tools to analyze TCP connections and identify slow or dropped connections. Check for TCP windowing issues or retransmissions.\\n5. Session, Presentation, and Application Layers: Analyze application logs for errors or performance issues. Monitor server resource utilization (CPU, memory, disk I/O). Check DNS resolution and web server performance.\\n\\nAfter each step, test the network performance to see if the issue has been resolved.\",
    \"Routing protocol comparison: \\n\\nRIP: Distance vector, simple, limited hop count, slow convergence, prone to routing loops. Suitable for small, simple networks. Metric: Hop count.\\nOSPF: Link-state, complex, fast convergence, scalable, supports VLSM. Suitable for medium to large networks. Metric: Cost (based on bandwidth).\\nBGP: Path vector, used for inter-domain routing (between ASes), highly scalable, complex configuration, focuses on policy-based routing. Suitable for large networks such as the internet. Metric: Path attributes.\\n\\nScenario: A company with multiple branch offices connected via WAN links. The network requires fast convergence and scalability. Protocol Proposal: OSPF would be the most suitable routing protocol because it supports VLSM, provides fast convergence, and is capable of handling medium to large network sizes. OSPF utilizes link-state information to build a complete network map, allowing for efficient route selection and rapid adaptation to network changes. The use of OSPF allows for multiple paths and cost considerations.\",
    \"Data breach investigation plan:\\n\\n1. Incident Response Team Activation: Assemble a team including IT, security, legal, and public relations personnel.\\n2. Containment: Isolate affected systems and network segments to prevent further spread. Change passwords for all user accounts. Disable compromised accounts.\\n3. Investigation: Analyze network traffic, system logs, and security logs to determine the scope and nature of the breach. Identify the entry point and the data that was compromised. Use tools like SIEM, intrusion detection systems, and packet capture analysis.\\n4. Eradication: Remove malware or malicious code from affected systems. Patch vulnerabilities that were exploited. Rebuild compromised systems from backups.\\n5. Recovery: Restore systems and data from backups. Verify the integrity of recovered data. Monitor systems for any signs of recurrence.\\n6. Post-Incident Analysis: Document the incident and the response. Identify lessons learned and implement improvements to prevent future incidents. Review and update security policies and procedures. Provide security awareness training to employees.\"
  ]
}
```"""),
                ],
            ),
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=json_input),
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
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            response_text += chunk.text
        print(response_text)

        # Convert response to JSON format
        try:
            response_json = json.loads(response_text)
        except json.JSONDecodeError:
            return {"error": "Invalid JSON response from the API"}

        return response_json  # Returning JSON instead of printing