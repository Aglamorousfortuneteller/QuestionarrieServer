let currentQuestion = 0;
let questions = [];
let responses = [];
let demographics = {};
let currentLang = localStorage.getItem("lang") || "ru";

const langMap = {
  ru: {
    next: "Далее",
    exit: "Выйти",
    saved: "Ваши ответы были сохранены.",
    placeholder: "Введите ваш ответ..."
  },
  en: {
    next: "Next",
    exit: "Exit",
    saved: "Your answers have been saved.",
    placeholder: "Type your answer..."
  }
};

fetch(`questions_${currentLang}.json`)
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
  if (q.type !== 'message') responses.push(entry);

  if (currentQuestion === 0) demographics.age = entry.answer;
  if (currentQuestion === 1) demographics.sex = entry.answer;
  if (currentQuestion === 2) demographics.gender = entry.answer;

  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showFinalMessage();
  }
});

function showQuestion() {
  const q = questions[currentQuestion];
  const lang = currentLang;
  questionText.innerHTML = `<h3>${q.question}</h3>`;
  answerForm.innerHTML = '';
  nextButton.style.display = "inline-block";
  nextButton.textContent = langMap[lang].next;

  if (q.type === 'single') {
    q.options.forEach((opt) => {
      const value = (opt === "Пропустить" || opt === "Skip") ? "Не указано" : opt;
      answerForm.innerHTML += `
        <label>
          <input type="radio" name="answer" value="${value}"> ${opt}
        </label><br>`;
    });
  }

  if (q.type === 'multiple') {
    q.options.forEach((opt) => {
      const value = (opt === "Пропустить" || opt === "Skip") ? "Не указано" : opt;
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
        <textarea name="answer" rows="4" cols="50" placeholder="${langMap[lang].placeholder}"></textarea>
      </label>`;
  }

  if (q.type === 'video') {
    answerForm.innerHTML = `
      <video width="100%" controls style="margin-bottom: 1rem;">
        <source src="${q.video}" type="video/mp4">
        Ваш браузер не поддерживает видео.
      </video>
      <label>
        <textarea name="answer" rows="4" cols="50" placeholder="${langMap[lang].placeholder}"></textarea>
      </label>`;
  }

  if (q.type === 'message') {
    nextButton.style.display = "none";
    answerForm.innerHTML = `
      <p>${q.question}</p>
      <button id="exit-button" style="margin-top: 1rem; padding: 0.8rem 1.5rem; font-weight: bold; border: none; border-radius: 5px; background: #007394; color: white; cursor: pointer;">
        ${langMap[lang].exit}
      </button>`;

    setTimeout(() => {
      const exitButton = document.getElementById("exit-button");
      if (exitButton) {
        exitButton.addEventListener("click", () => {
          sendDataAndExit();
        });
      }
    }, 100);
  }
}

function showFinalMessage() {
  const lang = currentLang;
  questionText.innerHTML = `<h2>${langMap[lang].saved}</h2>`;
  answerForm.innerHTML = `
    <button id="exit-button" style="margin-top: 1rem; padding: 0.8rem 1.5rem; font-weight: bold; border: none; border-radius: 5px; background: #007394; color: white; cursor: pointer;">
      ${langMap[lang].exit}
    </button>`;
  nextButton.style.display = 'none';

  setTimeout(() => {
    document.getElementById("exit-button").addEventListener("click", sendDataAndExit);
  }, 100);
}

function sendDataAndExit() {
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
}
