# 🧠 QuestionarrieCognitiveServer

## Description (English)

**Sever template for a cognitive study questionnaire.**  
This project is a lightweight web-based demo version, developed as a prototype during research work in a neuroscience and physiology lab (unnamed for anonymity).

### ✨ Features:
- Login/password system for participant access  
- Instruction screen before questionnaire begins  
- Demographic questions (age, biological sex, gender identity)  
- Various question types:  
  - single choice  
  - multiple choice  
  - numeric input  
  - free text input  
- Embedded video with a follow-up question  
- Final screen with "exit" button  
- All responses saved locally in `responses.json` and `responses.csv`

### 🌐 Language Support
- Interface and questions available in **English** and **Russian**  
- Automatically loads `questions_en.json` or `questions_ru.json` based on selected language  
- Language preference is stored in browser `localStorage`

### 🔧 Tech stack:
- HTML / CSS / JavaScript (Frontend)  
- Python / Flask (Backend)  
- JSON & CSV as storage formats

> This version runs online. The next step will be fixing the responce database and analytics dashboard.

---

## Описание (на русском)

**Серверная болванка опросника для когнитивного исследования.**  
Проект представляет собой лёгкую веб-реализацию, разработанную в рамках научной деятельности в лаборатории нейрофизиологии (название не указывается по этическим соображениям).

### ✨ Возможности:
- Авторизация по логину и паролю  
- Инструкции перед началом  
- Демографические вопросы (возраст, биологический пол, гендер)  
- Типы вопросов:  
  - выбор одного варианта  
  - выбор нескольких  
  - числовой ввод  
  - свободный текст  
- Встроенное видео с последующим вопросом  
- Финальный экран с кнопкой выхода  
- Сохранение всех ответов в `responses.json` и `responses.csv`

### 🌐 Поддержка языков
- Интерфейс и вопросы доступны на **русском** и **английском** языках  
- Загружается `questions_ru.json` или `questions_en.json` в зависимости от выбранного языка  
- Язык сохраняется в `localStorage` браузера

### 🔧 Используемые технологии:
- HTML / CSS / JavaScript (Frontend)  
- Python / Flask (Backend)  
- Локальное хранение в формате JSON и CSV

> Эта версия разворачивается на сервере. Следующим этапом станет исправление проблемы доступа удалённой БД и создание системы анализа.
