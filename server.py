from flask import Flask, request, jsonify
import json
import os
from flask_cors import CORS
from flask_bcrypt import Bcrypt  # Added for password hashing
from Rag import store_dataset, retrieve_chunks
from ollama_model import generate_answer
import traceback
import logging
from waitress import serve
from api import Question_API

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
bcrypt = Bcrypt(app)  # Initialize Bcrypt for password hashing

if not os.path.exists("DB"):
    os.makedirs("DB")

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

STUDENTS_FILE = "DB/students.json"
STAFFS_FILE = "DB/staffs.json"
SUBJECTS_DIR = "DB/subjects"

# Initialize files if they don’t exist
if not os.path.exists(STUDENTS_FILE):
    with open(STUDENTS_FILE, "w") as f:
        json.dump([], f)
if not os.path.exists(STAFFS_FILE):
    with open(STAFFS_FILE, "w") as f:
        json.dump([], f)

# Helper function to read JSON
def read_json(file):
    if os.path.exists(file) and os.path.getsize(file) > 0:
        with open(file, "r") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                logger.error(f"Invalid JSON in {file}, initializing as empty list")
                return []
    return []

# Helper function to write JSON
def write_json(file, data):
    with open(file, "w") as f:
        json.dump(data, f, indent=4)

@app.route('/store', methods=['POST'])
def store():
    logger.debug("Received /store request")
    try:
        data = request.json
        if not data or 'text' not in data:
            logger.error("No text provided in request")
            return jsonify({"error": "No text provided"}), 400
        
        raw_text = data['text']
        logger.debug(f"Processing text: {raw_text[:100]}...")
        chunks = store_dataset(raw_text)
        logger.debug("Chunk storage completed, sending response")
        response = jsonify({"message": "success", "stored_chunks": len(chunks)})
        logger.debug("Response prepared")
        return response, 200
    except Exception as e:
        logger.error(f"Error in /store: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/query', methods=['POST'])
def query():
    logger.debug("Received /query request")
    try:
        data = request.json
        if not data or 'query' not in data:
            logger.error("No query provided in request")
            return jsonify({"error": "No query provided"}), 400
        
        query_text = data['query']
        logger.debug(f"Retrieving chunks for query: {query_text}")
        chunks = retrieve_chunks(query_text, top_k=3)
        logger.debug("Chunks retrieved, generating answer")
        answer = generate_answer(query_text, top_k=3)
        logger.debug("Answer generated, preparing response")
        response = jsonify({
            "answer": answer
        })
        logger.debug("Response prepared")
        return response, 200
    except Exception as e:
        logger.error(f"Error in /query: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/subjects", methods=["GET"])
def get_subjects():
    subjects_dir = "DB/subjects"
    subjects_data = {}
    
    if not os.path.exists(subjects_dir):
        return jsonify({"error": "Subjects directory not found"}), 404
    
    for filename in os.listdir(subjects_dir):
        if filename.endswith(".json"):
            subject_name = filename.replace(".json", "")
            file_path = os.path.join(subjects_dir, filename)
            subjects_data[subject_name] = read_json(file_path)
    
    return jsonify(subjects_data)

# Register Student
@app.route("/register/student", methods=["POST"])
def register_student():
    data = request.json
    students = read_json(STUDENTS_FILE)
    
    # Check if email exists
    for student in students:
        if student["email"] == data["email"]:
            return jsonify({"error": "Student with this email already exists!"}), 400

    # Ensure required fields are present
    required_fields = ["firstName", "lastName", "email", "password", "dept", "year"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    students.append({
        "firstName": data["firstName"],
        "lastName": data["lastName"],
        "email": data["email"],
        "password": bcrypt.generate_password_hash(data["password"]).decode('utf-8'),  # Hash the password
        "dept": data["dept"],
        "year": data["year"],
        "viewed": []  # Initialize viewed sets
    })
    write_json(STUDENTS_FILE, students)
    return jsonify({"message": "Student registered successfully!"})

# Register Teacher
@app.route("/register/teacher", methods=["POST"])
def register_teacher():
    data = request.json
    teachers = read_json(STAFFS_FILE)
    
    # Check if email exists
    for teacher in teachers:
        if teacher["email"] == data["email"]:
            return jsonify({"error": "Teacher with this email already exists!"}), 400

    # Ensure required fields are present
    required_fields = ["firstName", "lastName", "email", "password", "dept", "position"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    teachers.append({
        "firstName": data["firstName"],
        "lastName": data["lastName"],
        "email": data["email"],
        "password": bcrypt.generate_password_hash(data["password"]).decode('utf-8'),  # Hash the password
        "dept": data["dept"],
        "position": data["position"]
    })
    write_json(STAFFS_FILE, teachers)
    return jsonify({"message": "Teacher registered successfully!"})

# Login Student
@app.route("/login/student", methods=["POST"])
def login_student():
    data = request.json
    students = read_json(STUDENTS_FILE)

    for student in students:
        if student["email"] == data["email"] and bcrypt.check_password_hash(student["password"], data["password"]):
            # Combine first name and last name
            full_name = f"{student['firstName']} {student['lastName']}"
            return jsonify({"message": "Student login successful!", "name": full_name})

    return jsonify({"error": "Invalid email or password!"}), 401

# Login Teacher
@app.route("/login/teacher", methods=["POST"])
def login_teacher():
    data = request.json
    teachers = read_json(STAFFS_FILE)

    for teacher in teachers:
        if teacher["email"] == data["email"] and bcrypt.check_password_hash(teacher["password"], data["password"]):
            # Combine first name and last name
            full_name = f"{teacher['firstName']} {teacher['lastName']}"
            return jsonify({"message": "Teacher login successful!", "name": full_name})

    return jsonify({"error": "Invalid email or password!"}), 401

@app.route("/subjects/<subject_name>", methods=["GET"])
def get_subject(subject_name):
    subjects_dir = "DB/subjects"
    file_path = os.path.join(subjects_dir, f"{subject_name}.json")

    if not os.path.exists(file_path):
        return jsonify({"error": "Subject not found"}), 404

    subject_data = read_json(file_path)
    return jsonify(subject_data)

@app.route("/subjects/<subject_name>/<set_name>", methods=["GET"])
def get_questions(subject_name, set_name):
    file_path = os.path.join(SUBJECTS_DIR, f"{subject_name}.json")

    if not os.path.exists(file_path):
        return jsonify({"error": "Subject not found"}), 404

    subject_data = read_json(file_path)

    if set_name not in subject_data:
        return jsonify({"error": "Set not found"}), 404

    # Get email from headers
    email = request.headers.get("Email")
    if email:
        track_viewed_set(email, subject_name, set_name)

    return jsonify(subject_data[set_name])

def track_viewed_set(email, subject_name, set_name):
    """Tracks viewed question sets in students.json"""
    students_data = read_json(STUDENTS_FILE)

    # Find the user in students.json
    for student in students_data:
        if student.get("email") == email:
            if "viewed" not in student:
                student["viewed"] = []  # Create viewed key if not present

            # Check if the subject exists, if not add it
            subject_entry = next((sub for sub in student["viewed"] if sub["subject"] == subject_name), None)

            if subject_entry:
                # Add set if not already viewed
                if set_name not in subject_entry["sets"]:
                    subject_entry["sets"].append(set_name)
            else:
                # Add new subject entry
                student["viewed"].append({"subject": subject_name, "sets": [set_name]})

            write_json(STUDENTS_FILE, students_data)
            return

    # If user not found, create a new entry
    students_data.append({
        "email": email,
        "viewed": [{"subject": subject_name, "sets": [set_name]}]
    })
    write_json(STUDENTS_FILE, students_data)

@app.route("/students/viewed", methods=["GET"])
def get_viewed_students():
    students_data = read_json(STUDENTS_FILE)

    subject_view_data = {}

    for student in students_data:
        email = student.get("email")
        viewed = student.get("viewed", [])
        # Extract additional student details
        first_name = student.get("firstName", "")
        last_name = student.get("lastName", "")
        dept = student.get("dept", "")
        year = student.get("year", "")

        for subject in viewed:
            subject_name = subject["subject"]
            viewed_sets = subject["sets"]

            if subject_name not in subject_view_data:
                subject_view_data[subject_name] = []

            subject_view_data[subject_name].append({
                "email": email,
                "firstName": first_name,
                "lastName": last_name,
                "dept": dept,
                "year": year,
                "viewed_sets": viewed_sets
            })

    return jsonify(subject_view_data)

@app.route("/students/viewed-sets", methods=["GET"])
def get_viewed_sets():
    try:
        # Get the user's email from the request headers
        email = request.headers.get("Email")
        if not email:
            logger.error("Email header is required")
            return jsonify({"error": "Email header is required"}), 400

        # Read students.json to find the user
        students_data = read_json(STUDENTS_FILE)
        user = next((student for student in students_data if student["email"] == email), None)
        if not user:
            logger.error(f"User with email {email} not found")
            return jsonify({"error": "User not found"}), 404

        # Prepare the response
        viewed_sets_data = {}
        for viewed in user.get("viewed", []):
            subject_name = viewed["subject"]
            sets = viewed["sets"]

            # Fetch the subject data from DB/subjects
            subject_file = os.path.join(SUBJECTS_DIR, f"{subject_name}.json")
            if not os.path.exists(subject_file):
                logger.warning(f"Subject file {subject_file} not found")
                continue  # Skip if subject file is not found

            subject_data = read_json(subject_file)
            if not subject_data:
                logger.warning(f"Subject file {subject_file} is empty or invalid")
                continue  # Skip if subject data couldn't be loaded

            # For each set, get the question counts
            viewed_sets_data[subject_name] = {}
            for set_name in sets:
                set_data = subject_data.get(set_name, {})
                viewed_sets_data[subject_name][set_name] = {
                    "short": len(set_data.get("short", [])),
                    "medium": len(set_data.get("medium", [])),
                    "long": len(set_data.get("long", []))
                }

        if not viewed_sets_data:
            logger.info(f"No viewed sets found for user {email}")
            return jsonify({"error": "No viewed sets found for this user"}), 404

        logger.debug(f"Returning viewed sets data for user {email}: {viewed_sets_data}")
        return jsonify(viewed_sets_data), 200

    except Exception as e:
        logger.error(f"Error in /students/viewed-sets: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/questions/create", methods=["POST"])
def create_question():
    print("Received request to create question")
    for i in range(10):
        print("Iteration", i)
    try:
        data = request.get_json()
        print("Data", data)
        subject_name = data.get("subject_name")
        topics = data.get("topics")
        short_answer = data.get("short_answer")
        medium_answer = data.get("medium_answer")
        long_answer = data.get("long_answer")
        types = data.get("type")
        print("Types", types)

        if not all([subject_name, topics, short_answer, medium_answer, long_answer]):
            return jsonify({"status": "error", "message": "Missing required fields"}), 400

        input_data = {
            "subject_name": subject_name,
            "topics": topics,
            "type" : types,
            "short_answer": short_answer,
            "medium_answer": medium_answer,
            "long_answer": long_answer
        }
        print(input_data)

        json_text = json.dumps(input_data, indent=2)
        api = Question_API()
        response = api.generate(json_text)

        subject_file = os.path.join(SUBJECTS_DIR, f"{subject_name}.json")

        if os.path.exists(subject_file):
            with open(subject_file, "r") as file:
                subject_data = json.load(file)
        else:
            subject_data = {}

        set_number = f"set-{len(subject_data) + 1}"
        subject_data[set_number] = response

        with open(subject_file, "w") as file:
            json.dump(subject_data, file, indent=2)

        return jsonify({"status": "success", "message": "Question set added successfully", "set": set_number}), 200
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)