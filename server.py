from flask import Flask, request, jsonify
import json, os
from flask_cors import CORS
from google import genai
from api import API

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

if not os.path.exists("DB"):
    os.makedirs("DB")

STUDENTS_FILE = "DB/students.json"
STAFFS_FILE = "DB/staffs.json"
SUBJECTS_DIR = "DB/subjects"

# Helper function to read JSON print
def read_json(file):
    if os.path.exists(file):
        with open(file, "r") as f:
            return json.load(f)
    return []

# Helper function to write JSON
def write_json(file, data):
    with open(file, "w") as f:
        json.dump(data, f, indent=4)


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
    
    # Check if user exists
    for student in students:
        if student["username"] == data["username"]:
            return jsonify({"error": "Student already exists!"}), 400

    students.append(data)
    write_json(STUDENTS_FILE, students)
    return jsonify({"message": "Student registered successfully!"})

# Register Teacher
@app.route("/register/teacher", methods=["POST"])
def register_teacher():
    data = request.json
    teachers = read_json(STAFFS_FILE)
    
    # Check if user exists
    for teacher in teachers:
        if teacher["username"] == data["username"]:
            return jsonify({"error": "Teacher already exists!"}), 400

    teachers.append(data)
    write_json(STAFFS_FILE, teachers)
    return jsonify({"message": "Teacher registered successfully!"})

# Login Student
@app.route("/login/student", methods=["POST"])
def login_student():
    data = request.json
    students = read_json(STUDENTS_FILE)

    for student in students:
        if student["username"] == data["username"] and student["password"] == data["password"]:
            return jsonify({"message": "Student login successful!"})

    return jsonify({"error": "Invalid credentials!"}), 401

# Login Teacher
@app.route("/login/teacher", methods=["POST"])
def login_teacher():
    data = request.json
    teachers = read_json(STAFFS_FILE)

    for teacher in teachers:
        if teacher["username"] == data["username"] and teacher["password"] == data["password"]:
            return jsonify({"message": "Teacher login successful!"})

    return jsonify({"error": "Invalid credentials!"}), 401

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

    # Get username from headers
    username = request.headers.get("Username")
    if username:
        track_viewed_set(username, subject_name, set_name)

    return jsonify(subject_data[set_name])

def track_viewed_set(username, subject_name, set_name):
    """Tracks viewed question sets in students.json"""
    students_data = read_json(STUDENTS_FILE)

    # Find the user in students.json
    for student in students_data:
        if student.get("username") == username:
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
        "username": username,
        "viewed": [{"subject": subject_name, "sets": [set_name]}]
    })
    write_json(STUDENTS_FILE, students_data)

@app.route("/students/viewed", methods=["GET"])
def get_viewed_students():
    students_data = read_json(STUDENTS_FILE)

    subject_view_data = {}

    for student in students_data:
        username = student.get("username")
        viewed = student.get("viewed", [])

        for subject in viewed:
            subject_name = subject["subject"]
            viewed_sets = subject["sets"]

            if subject_name not in subject_view_data:
                subject_view_data[subject_name] = []

            subject_view_data[subject_name].append({
                "username": username,
                "viewed_sets": viewed_sets
            })

    return jsonify(subject_view_data)

@app.route("/questions/create", methods=["POST"])
def create_question():
    try:
        data = request.get_json()
        subject_name = data.get("subject_name")
        topics = data.get("topics")
        short_answer = data.get("short_answer")
        medium_answer = data.get("medium_answer")
        long_answer = data.get("long_answer")

        if not all([subject_name, topics, short_answer, medium_answer, long_answer]):
            return jsonify({"status": "error", "message": "Missing required fields"}), 400

        input_data = {
            "subject_name": subject_name,
            "topics": topics,
            "short_answer": short_answer,
            "medium_answer": medium_answer,
            "long_answer": long_answer
        }

        json_text = json.dumps(input_data, indent=2)
        api = API()
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
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    # create_question("Computer Networks", ["TCP/IP Model", "Routing", "Security"], 5, 3, 4)
    app.run(host="0.0.0.0", port=5000, debug=True)