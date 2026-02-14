"use strict";

class Quiz {
  constructor() {
    // Selectors
    this.quizTitle = document.getElementById("quiz-title");
    this.question = document.getElementById("question");
    this.questionParagraph = document.querySelector(
      ".question-container__paragraph",
    );
    this.questionContainer = document.querySelector(".question-container");

    this.answersAll = document.querySelectorAll(".answer-box__answer");
    this.answerBoxAll = document.querySelectorAll(".answer-box");
    this.answerFieldSet = document.querySelector(".answer-container__fieldset");
    this.radioAll = document.querySelectorAll('input[type="radio"]');
    this.submitBtn = document.getElementById("submit");
    this.submitError = document.querySelector(".answer-container__error");

    this.quizCompleted = document.querySelector(".quiz-completed");

    // Data
    this.USERSTATE = {
      currentQuiz: 0,
      currentQuestion: 0,
      currentScore: 0,
      phase: "score",
    };

    this.init();
  }

  async init() {
    await this.loadData();
    this.renderPage();
    this.removeSubmitError();
    this.handleSubmitClick();
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

  enableRadioButtons() {
    this.radioAll.forEach((item) => {
      item.disabled = false;
    });
  }

  resetAnswerBoxes() {
    this.answerBoxAll.forEach((item) => {
      item.classList.remove("answer-box--incorrect");
      item.classList.remove("answer-box--correct");
    });
    this.radioAll.forEach((item) => {
      item.checked = false;
    });
  }

  setAnsweringPhase() {
    this.USERSTATE.phase = "answering";
    this.submitBtn.textContent = "Submit Answer";
  }

  setSubmittedPhase() {
    this.USERSTATE.phase = "submitted";
    this.submitBtn.textContent = "Next";
  }

  renderPage() {
    // this.updateView();
    this.resetAnswerBoxes();
    this.returnCurrentQuiz();
    this.setAnsweringPhase();
    this.enableRadioButtons();

    this.questionParagraph.textContent = `Question ${this.USERSTATE.currentQuestion + 1} of ${this.currentQuiz.questions.length}`;
    this.quizTitle.textContent = this.currentQuiz.title;

    this.question.textContent = this.currentQuestion.question;

    this.answersAll.forEach((item, i) => {
      item.textContent = this.currentQuestion.options[i];
    });
  }

  removeSubmitError() {
    this.radioAll.forEach((item) =>
      item.addEventListener("click", () => {
        this.submitError.classList.add("visually-hidden");
      }),
    );
  }

  submitAnswer() {
    const checked = document.querySelector('input[name="answer"]:checked');
    this.returnCurrentQuiz();

    if (checked) {
      const selectedAnswer = checked.getAttribute("value");
      const submittedAnswer = this.currentQuestion.options[selectedAnswer];
      const correctAnswer = this.currentQuestion.answer;
      const correctAnswerIndex =
        this.currentQuestion.options.indexOf(correctAnswer);

      this.setSubmittedPhase();

      this.disableRadioButtons();

      if (submittedAnswer !== correctAnswer) {
        checked.parentElement.classList.add("answer-box--incorrect");

        this.radioAll[correctAnswerIndex].parentElement.classList.add(
          "answer-box--correct",
        );
      } else {
        this.USERSTATE.currentScore++;
        checked.parentElement.classList.add("answer-box--correct");
      }
    } else {
      this.submitError.classList.remove("visually-hidden");
    }
    console.log(this.USERSTATE.currentScore);
  }

  nextQuestion() {
    if (
      this.USERSTATE.currentQuestion <
      this.currentQuiz.questions.length - 1
    ) {
      this.USERSTATE.currentQuestion++;
      this.renderPage();
    } else {
      this.displayScoreScreen();
    }
  }

  handleSubmitClick() {
    this.submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (this.USERSTATE.phase === "answering") {
        this.submitAnswer();
      } else if (this.USERSTATE.phase === "submitted") {
        this.nextQuestion();
      }
    });
  }

  displayScoreScreen() {
    this.USERSTATE.phase = "score";
    this.updateView();
    document.querySelector(".score-box__heading").textContent =
      this.USERSTATE.title;
    document.querySelector(".score-box__score").textContent =
      this.USERSTATE.currentScore;
    document.querySelector(".score-box__off").textContent =
      `Out of ${this.data.quizzes[`${this.USERSTATE.currentQuiz}`].questions.length}`;
  }

  updateView() {
    if (this.USERSTATE.phase === "menu") {
      return;
    } else if (
      this.USERSTATE.phase === "answering" ||
      this.USERSTATE.phase === "submitted"
    ) {
      this.quizCompleted.classList.remove("quiz-completed--visible");
      this.questionContainer.classList.remove("question-container--hidden");
      this.answerFieldSet.classList.remove(
        "answer-container__fieldset--hidden",
      );
    } else if (this.USERSTATE.phase === "score") {
      this.quizCompleted.classList.add("quiz-completed--visible");
      this.questionContainer.classList.add("question-container--hidden");
      this.answerFieldSet.classList.add("answer-container__fieldset--hidden");
    }
  }
}
new Quiz();
