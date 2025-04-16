from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import psycopg2
import os
from datetime import datetime

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

DB_URL = os.getenv("DATABASE_URL") or "postgresql://questionnaire_db_26yt_user:U0G9XSuvfPNWmG3bDofMPJu3tzFwcBAO@dpg-cvvomg3uibrs73blgfb0-a/questionnaire_db_26yt"

# Initialize DB and ensure admin exists
def init_db():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            login TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)
    conn.commit()
    cur.execute("SELECT * FROM users WHERE login = 'admin'")
    if not cur.fetchone():
        cur.execute("INSERT INTO users (login, password) VALUES (%s, %s)", ("admin", "letmein"))
        conn.commit()
    cur.close()
    conn.close()

init_db()

@app.route("/")
def index():
    return send_from_directory('.', 'index.html')

@app.route("/get-users", methods=["GET"])
def get_users():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    cur.execute("SELECT login, password FROM users")
    users = [{"login": row[0], "password": row[1]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(users)

@app.route("/add-user", methods=["POST"])
def add_user():
    new_user = request.json
    if "login" not in new_user or "password" not in new_user:
        return jsonify({"error": "Недостаточно данных"}), 400

    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE login = %s", (new_user["login"],))
    if cur.fetchone():
        cur.close()
        conn.close()
        return jsonify({"error": "Логин уже существует"}), 409

    cur.execute("INSERT INTO users (login, password) VALUES (%s, %s)", (new_user["login"], new_user["password"]))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"status": "user added", "user": new_user})

@app.route("/submit", methods=["POST"])
def save_response():
    entry = request.json
    entry["timestamp"] = datetime.now().isoformat()
    return jsonify({"status": "ok (mocked, DB submission coming soon)"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)