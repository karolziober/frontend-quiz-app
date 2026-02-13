"use strict";

class Quiz {
  constructor() {
    // Selectors
    this.quizTitle = document.getElementById("quiz-title");
    this.question = document.getElementById("question");
    this.answersAll = document.querySelectorAll(".answer-box__answer");
    this.submitBtn = document.getElementById("submit");

    // Data
    this.USERSTATE = { currentQuiz: 0, currentQuestion: 0, currentScore: 0 };

    this.init();
  }

  async init() {
    await this.loadData();
    this.renderPage();
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

  renderPage() {
    // const currentQuiz = this.data.quizzes[`${this.USERSTATE.currentQuiz}`];
    // const currentQuesion =
    //   currentQuiz.questions[`${this.USERSTATE.currentQuestion}`];
    this.returnCurrentQuiz();
    this.quizTitle.textContent = this.currentQuiz.title;

    this.question.textContent = this.currentQuestion.question;

    this.answersAll.forEach((item, i) => {
      item.textContent = this.currentQuestion.options[i];
    });
  }

  submitAnswer() {
    this.submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const checked = document.querySelector('input[name="answer"]:checked');

      if (checked) {
        const selectedAnswer = checked.getAttribute("value");

        const submittedAnswer =
          this.data.quizzes[`${this.USERSTATE.currentQuiz}`].questions[
            `${this.USERSTATE.currentQuestion}`
          ].options[selectedAnswer];

        const correctAnswer =
          this.data.quizzes[`${this.USERSTATE.currentQuiz}`].questions[
            `${this.USERSTATE.currentQuestion}`
          ].answer;

        submittedAnswer !== correctAnswer
          ? console.log(false)
          : console.log(true);
      }
    });
  }
}
new Quiz();
