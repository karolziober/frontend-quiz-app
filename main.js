"use strict";

class Quiz {
  constructor() {
    // Selectors
    this.quizTitle = document.getElementById("quiz-title");
    this.question = document.getElementById("question");
    this.answersAll = document.querySelectorAll(".answer-box__answer");
    this.radioAll = document.querySelectorAll('input[type="radio"]');
    this.submitBtn = document.getElementById("submit");
    this.submitError = document.querySelector(".answer-container__error");

    // Data
    this.USERSTATE = { currentQuiz: 0, currentQuestion: 0, currentScore: 0 };

    this.init();
  }

  async init() {
    await this.loadData();
    this.renderPage();
    this.removeSubmitError();
    this.submitAnswer();
  }

  async loadData() {
    try {
      const response = await fetch("data.json");
      if (!response.ok) {
        throw new Error("Response not ok");
      }
      this.data = await response.json();
    } catch (error) {
      console.log("Data not loaded");
      this.data = null;
    }
  }

  returnCurrentQuiz() {
    this.currentQuiz = this.data.quizzes[`${this.USERSTATE.currentQuiz}`];
    this.currentQuestion =
      this.currentQuiz.questions[`${this.USERSTATE.currentQuestion}`];
  }

  disableRadioButtons() {
    this.radioAll.forEach((item) => {
      item.disabled = true;
    });
  }

  renderPage() {
    this.returnCurrentQuiz();
    console.log(this.USERSTATE.currentScore);
    this.quizTitle.textContent = this.currentQuiz.title;

    this.question.textContent = this.currentQuestion.question;

    this.answersAll.forEach((item, i) => {
      item.textContent = this.currentQuestion.options[i];
    });
  }

  removeSubmitError() {
    this.answersAll.forEach((item) =>
      item.addEventListener("click", () => {
        this.submitError.classList.add("visually-hidden");
      }),
    );
  }

  submitAnswer() {
    this.submitBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const checked = document.querySelector('input[name="answer"]:checked');
      this.returnCurrentQuiz();

      if (checked) {
        const selectedAnswer = checked.getAttribute("value");
        const submittedAnswer = this.currentQuestion.options[selectedAnswer];
        const correctAnswer = this.currentQuestion.answer;

        this.disableRadioButtons();

        if (submittedAnswer !== correctAnswer) {
          checked.parentElement.classList.add("answer-box--incorrect");
        } else {
          this.USERSTATE.currentScore++;
          checked.parentElement.classList.add("answer-box--correct");
          console.log(this.USERSTATE.currentScore);
        }
      } else {
        this.submitError.classList.remove("visually-hidden");
      }
    });
  }
}
new Quiz();
