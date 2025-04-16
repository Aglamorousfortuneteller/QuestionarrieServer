from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import psycopg2
import os
from datetime import datetime

# Flask setup
app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# PostgreSQL connection config
DATABASE_URL = os.environ.get("DATABASE_URL") or "postgresql://questionnaire_db_26yt_user:U0G9XSuvfPNWmG3bDofMPJu3tzFwcBAO@dpg-cvvomg3uibrs73blgfb0-a/questionnaire_db_26yt"

# Ensure the user table exists
def init_db():
    with psycopg2.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            cur.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    login TEXT PRIMARY KEY,
                    password TEXT NOT NULL
                );
            ''')
            # Ensure admin exists
            cur.execute("SELECT * FROM users WHERE login='admin'")
            if not cur.fetchone():
                cur.execute("INSERT INTO users (login, password) VALUES (%s, %s)", ('admin', 'letmein'))
        conn.commit()

@app.route("/")
def index():
    return send_from_directory('.', 'index.html')

@app.route("/submit", methods=["POST"])
def save_response():
    entry = request.json
    entry["timestamp"] = datetime.now().isoformat()
    # You can implement PostgreSQL logging here if needed later
    return jsonify({"status": "ok"})

@app.route("/add-user", methods=["POST"])
def add_user():
    new_user = request.json
    if "login" not in new_user or "password" not in new_user:
        return jsonify({"error": "Недостаточно данных"}), 400

    try:
        with psycopg2.connect(DATABASE_URL) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM users WHERE login=%s", (new_user["login"],))
                if cur.fetchone():
                    return jsonify({"error": "Логин уже существует"}), 409
                cur.execute("INSERT INTO users (login, password) VALUES (%s, %s)",
                            (new_user["login"], new_user["password"]))
                conn.commit()
        return jsonify({"status": "user added", "user": new_user})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-users", methods=["GET"])
def get_users():
    try:
        with psycopg2.connect(DATABASE_URL) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT login, password FROM users")
                users = cur.fetchall()
        return jsonify([{"login": u[0], "password": u[1]} for u in users])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000)