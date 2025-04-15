let currentQuestion = 0;
let questions = [];
let responses = [];
let demographics = {};

fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
    showQuestion();
  });

const questionText = document.getElementById('question-text');
const answerForm = document.getElementById('answer-form');
const nextButton = document.getElementById('next-button');

nextButton.addEventListener('click', () => {
  const q = questions[currentQuestion];
  let answer = null;

  if (q.type === 'single') {
    const selected = document.querySelector('input[name="answer"]:checked');
    answer = selected ? selected.value : null;
  }

  if (q.type === 'multiple') {
    const selected = Array.from(document.querySelectorAll('input[name="answer"]:checked'));
    answer = selected.length > 0 ? selected.map(input => input.value) : null;
  }

  if (q.type === 'numeric') {
    const input = document.querySelector('input[name="answer"]');
    answer = input && input.value !== "" ? input.value : null;
  }

  if (q.type === 'text' || q.type === 'video') {
    const input = document.querySelector('textarea[name="answer"]');
    answer = input && input.value.trim() !== "" ? input.value : null;
  }

  const entry = {
    question: q.question,
    answer: answer || "Не указано"
  };
  responses.push(entry);

  if (currentQuestion === 0) demographics.age = entry.answer;
  if (currentQuestion === 1) demographics.sex = entry.answer;
  if (currentQuestion === 2) demographics.gender = entry.answer;
  if (q.type === 'message') return;  // не добавлять в responses

  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    // Показываем экран "Спасибо за участие"
    questionText.innerHTML = '<h2>Спасибо за участие!</h2>';
    answerForm.innerHTML = `
      <p>Ваши ответы были сохранены.</p>
      <button id="exit-button" style="margin-top: 1rem; padding: 0.8rem 1.5rem; font-weight: bold; border: none; border-radius: 5px; background: #007394; color: white; cursor: pointer;">
        Выйти
      </button>
    `;
    nextButton.style.display = 'none';

    // Сохраняем ответы
    fetch("http://localhost:5000/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: localStorage.getItem("userLogin") || "unknown_user",
        demographics: demographics,
        answers: responses
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Ответ сохранён:", data);
    })
    .catch(err => console.error("Ошибка сохранения:", err));

    // Обработчик кнопки "Выйти"
    setTimeout(() => {
      const exitButton = document.getElementById("exit-button");
      if (exitButton) {
        exitButton.addEventListener("click", () => {
          localStorage.removeItem("userLogin");
          window.location.href = "index.html";
        });
      }
    }, 100); // чуть позже, чтобы DOM успел обновиться
  }
});

function showQuestion() {
  const q = questions[currentQuestion];
  questionText.innerHTML = `<h3>${q.question}</h3>`;
  answerForm.innerHTML = '';

  if (q.type === 'single') {
    q.options.forEach((opt) => {
      const value = (opt === "Пропустить") ? "Не указано" : opt;
      answerForm.innerHTML += `
        <label>
          <input type="radio" name="answer" value="${value}"> ${opt}
        </label><br>`;
    });
  }

  if (q.type === 'multiple') {
    q.options.forEach((opt) => {
      const value = (opt === "Пропустить") ? "Не указано" : opt;
      answerForm.innerHTML += `
        <label>
          <input type="checkbox" name="answer" value="${value}"> ${opt}
        </label><br>`;
    });
  }

  if (q.type === 'numeric') {
    answerForm.innerHTML = `
      <label>
        <input type="number" name="answer" min="0" step="1">
      </label>`;
  }

  if (q.type === 'text') {
    answerForm.innerHTML = `
      <label>
        <textarea name="answer" rows="4" cols="50"></textarea>
      </label>`;
  }

  if (q.type === 'video') {
    answerForm.innerHTML = `
      <video width="100%" controls style="margin-bottom: 1rem;">
        <source src="${q.video}" type="video/mp4">
        Ваш браузер не поддерживает видео.
      </video>
      <label>
        <textarea name="answer" rows="4" cols="50" placeholder="Введите ваш ответ..."></textarea>
      </label>`;
  }

  if (q.type === 'message') {
    nextButton.style.display = "none";
    answerForm.innerHTML = `
      <button id="exit-button" style="margin-top: 1rem; padding: 0.8rem 1.5rem; font-weight: bold; border: none; border-radius: 5px; background: #007394; color: white; cursor: pointer;">
        Выйти
      </button>
    `;
  
    // Только по нажатию "Выйти"
    setTimeout(() => {
      const exitButton = document.getElementById("exit-button");
      if (exitButton) {
        exitButton.addEventListener("click", () => {
          fetch("http://localhost:5000/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              login: localStorage.getItem("userLogin") || "unknown_user",
              demographics: demographics,
              answers: responses
            })
          })
          .then(res => res.json())
          .then(data => {
            console.log("Ответы отправлены:", data);
            localStorage.removeItem("userLogin");
            window.location.href = "index.html";
          })
          .catch(err => {
            console.error("Ошибка при сохранении:", err);
            alert("Ошибка при сохранении данных. Попробуйте ещё раз.");
          });
        });
      }
    }, 100);
  }
  
  

}
