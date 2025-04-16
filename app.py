from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import csv
from datetime import datetime

app = Flask(__name__)
CORS(app)

# === Сохранение ответов ===
@app.route("/submit", methods=["POST"])
def save_response():
    entry = request.json
    entry["timestamp"] = datetime.now().isoformat()

    # === JSON ===
    if not os.path.exists("responses.json") or os.path.getsize("responses.json") == 0:
        data = []
    else:
        with open("responses.json", "r", encoding="utf-8") as f:
            data = json.load(f)

    # Заменяем старую запись
    data = [e for e in data if e["login"] != entry["login"]]
    data.append(entry)

    with open("responses.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    # === CSV (одна строка на пользователя) ===
    csv_file = "responses.csv"
    write_header = not os.path.exists(csv_file) or os.path.getsize(csv_file) == 0

    answers_combined = "; ".join(
        [f"{a['question']} - {a['answer']}" for a in entry.get("answers", [])]
    )

    with open(csv_file, "a", newline='', encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=[
            "login", "age", "sex", "gender", "answers", "timestamp"
        ])
        if write_header:
            writer.writeheader()

        writer.writerow({
            "login": entry.get("login"),
            "age": entry.get("demographics", {}).get("age", ""),
            "sex": entry.get("demographics", {}).get("sex", ""),
            "gender": entry.get("demographics", {}).get("gender", ""),
            "answers": answers_combined,
            "timestamp": entry["timestamp"]
        })

    return jsonify({"status": "ok"})

# === Добавление нового пользователя ===
@app.route("/add-user", methods=["POST"])
def add_user():
    new_user = request.json
    if "login" not in new_user or "password" not in new_user:
        return jsonify({"error": "Недостаточно данных"}), 400

    path = "loginData.json"

    if not os.path.exists(path):
        users = []
    else:
        with open(path, "r", encoding="utf-8") as f:
            try:
                users = json.load(f)
            except json.JSONDecodeError:
                users = []

    for u in users:
        if u["login"] == new_user["login"]:
            return jsonify({"error": "Логин уже существует"}), 409

    users.append(new_user)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(users, f, ensure_ascii=False, indent=2)

    return jsonify({"status": "user added", "user": new_user})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
