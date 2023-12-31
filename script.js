// storing values from html
const display = document.getElementById("display");
const question = document.getElementById("question");
const startBtn = document.getElementById("starts");
const countdownOverlay = document.getElementById("countdown");
const resultModal = document.getElementById("result");
const modalBackground = document.getElementById("modal-background");

// variable declaration
let userText = "";
let errorCount = 0;
let startTime;
let questionText = "";

// function to display questions from the json data file
const displayQuestion = () => {
  fetch("./data/texts.json")
    .then((res) => res.json())
    .then((data) => {
      questionText = data[Math.floor(Math.random() * data.length)];
      question.innerHTML = questionText;
    });
};

// initial function call to display text
displayQuestion();

// checks the user typed character and displays accordingly
const typeController = (e) => {
  const newLetter = e.key;

  // Handle backspace press
  if (newLetter == "Backspace") {
    userText = userText.slice(0, userText.length - 1);
    // Added errorCount to keep track of the number of total errors
    errorCount += 1;
    return display.removeChild(display.lastChild);
  }

  // these are the valid character we are allowing to type
  const validLetters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890!@#$%^&*()_+-={}[]'\".,?;";

  // if it is not a valid character like Control/Alt then skip displaying anything
  if (!validLetters.includes(newLetter)) {
    return;
  }

  userText += newLetter;

  const newLetterCorrect = validate(newLetter);

  // color changing for correct and incorrect input
  if (newLetterCorrect) {
    display.innerHTML += `<span class="green">${
      newLetter === " " ? "▪" : newLetter
    }</span>`;
  } else {
    display.innerHTML += `<span class="red">${
      newLetter === " " ? "▪" : newLetter
    }</span>`;
  }

  // check if given question text is equal to user typed text
  if (questionText === userText) {
    gameOver();
  }
};

// checking if the full text is complete
const validate = (key) => {
  if (key === questionText[userText.length - 1]) {
    return true;
  }
  return false;
};

// function call after typing completed
const gameOver = () => {
  document.removeEventListener("keydown", typeController);
  // the current time is the finish time
  // so total time taken is current time - start time
  const finishTime = new Date().getTime();
  // Added Math.floor to round out the time taken
  const timeTaken = Math.floor((finishTime - startTime) / 1000);

  // show result modal
  resultModal.innerHTML = "";
  resultModal.classList.toggle("hidden");
  modalBackground.classList.toggle("hidden");
  // clear user text
  display.innerHTML = "";
  // make it inactive
  display.classList.add("inactive");
  // show result
  resultModal.innerHTML += `
      <h1 style="margin-bottom: 5px;">Finished!</h1>
      <p style="margin-bottom: 5px;">WPM: <span class="bold red">${Math.floor(
        questionText.length / 5 / (timeTaken / 60)
      )}</span></p>
      <p style="margin-bottom: 5px;">You took: <span class="bold">${timeTaken}</span> seconds</p>
      <p style="margin-bottom: 5px;">You made <span class="bold red">${errorCount}</span> mistakes</p>
      
      <button onclick="closeModal()">Close</button>
    `;

  addHistory(questionText, timeTaken, errorCount);

  // restart everything
  startTime = null;
  errorCount = 0;
  userText = "";
  display.classList.add("inactive");
  displayQuestion();
};

// function to hide the modal after display
const closeModal = () => {
  modalBackground.classList.toggle("hidden");
  resultModal.classList.toggle("hidden");
};

const start = () => {
  // If already started, do not start again
  if (startTime) return;

  let count = 3;
  countdownOverlay.style.display = "flex";

  const startCountdown = setInterval(() => {
    // Added dynamic string
    countdownOverlay.innerHTML = `<h1>${count}</h1>`;

    // finished timer
    if (count == 0) {
      // -------------- START TYPING -----------------
      document.addEventListener("keydown", typeController);
      countdownOverlay.style.display = "flex";
      display.classList.remove("inactive");

      clearInterval(startCountdown);
      startTime = new Date().getTime();

      // Added to remove timer when the count reaches zero
      countdownOverlay.style.display = "none";
      countdownOverlay.innerText = "";
    }
    count--;
  }, 1000);
};

// START Countdown
startBtn.addEventListener("click", start);

// If history exists, show it
displayHistory();

// Show typing time spent
setInterval(() => {
  const currentTime = new Date().getTime();
  // Added Math.floor() to round out the time taken
  const timeSpent = Math.floor((currentTime - startTime) / 1000);

  document.getElementById("show-time").innerHTML = `${
    startTime ? timeSpent : 0
  } seconds`;
}, 1000);
