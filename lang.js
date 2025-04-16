// lang.js

const texts = {
    ru: {
      title: "Институт физиологии им. А.Б. Иванова",
      subtitle: "Доступ к закрытому опроснику",
      loginTitle: "Вход для участников",
      username: "Ваш идентификатор",
      password: "Пароль",
      submit: "Войти",
      footer: "Институт физиологии им. А.Б. Иванова. Лаборатория физиологии зрения.",
      error: "Неверный логин или пароль",
      loadError: "Ошибка загрузки базы пользователей"
    },
    en: {
      title: "Institute of Physiology A.B. Ivanov",
      subtitle: "Access to the confidential questionnaire",
      loginTitle: "Participant Login",
      username: "Your ID",
      password: "Password",
      submit: "Login",
      footer: "Institute of Physiology A.B. Ivanov. Laboratory of Visual Physiology.",
      error: "Incorrect username or password",
      loadError: "Failed to load user database"
    }
  };
  
  function switchLang(lang) {
    localStorage.setItem("lang", lang);
    applyLang(lang);
  }
  
  function applyLang(lang) {
    const t = texts[lang] || texts["ru"];
    document.documentElement.lang = lang;
    if (document.getElementById("title")) document.getElementById("title").textContent = t.title;
    if (document.getElementById("subtitle")) document.getElementById("subtitle").textContent = t.subtitle;
    if (document.getElementById("login-title")) document.getElementById("login-title").textContent = t.loginTitle;
    if (document.getElementById("label-username")) document.getElementById("label-username").textContent = t.username;
    if (document.getElementById("label-password")) document.getElementById("label-password").textContent = t.password;
    if (document.getElementById("submit-button")) document.getElementById("submit-button").textContent = t.submit;
    if (document.getElementById("footer-name")) document.getElementById("footer-name").textContent = t.footer;
    if (document.getElementById("lang-switcher")) {
      const sel = document.getElementById("lang-switcher").querySelector("select");
      if (sel) sel.value = lang;
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const currentLang = localStorage.getItem("lang") || "ru";
    applyLang(currentLang);
  
    const switcher = document.getElementById("lang-switcher");
    if (switcher) {
      const sel = switcher.querySelector("select");
      if (sel) {
        sel.addEventListener("change", (e) => switchLang(e.target.value));
      }
    }
  });