// storing current values
const histories = document.getElementById("histories");

// function to store the result in the session storage of the browser
function addHistory(questionText, timeTaken, errorCount) {
  const newRow = document.createElement("div");
  newRow.classList.add("card");

  newRow.innerHTML = `
    <h3>${questionText}</h3>
    <div>
    <p>You took: <span class="bold">${timeTaken}</span> seconds</p>
    <p>You made <span class="bold red">${errorCount}</span> mistakes</p>
    </div>
    `;

  histories.appendChild(newRow);

  let previousTests = JSON.parse(sessionStorage.getItem("testHistory")) || [];
  previousTests.push({ questionText, timeTaken, errorCount });
  sessionStorage.setItem("testHistory", JSON.stringify(previousTests));

  displayHistory();
}

// function to display the stored history to the users
function displayHistory() {
  histories.innerHTML = "";
  const previousTests = JSON.parse(sessionStorage.getItem("testHistory")) || [];

  previousTests.forEach((test) => {
    const newRow = document.createElement("div");
    newRow.classList.add("card");

    newRow.innerHTML = `
      <div class="display-history">
      <div>
        <h3>${test.questionText}</h3>
      </div>
      <div class="display-info">
        <p>Time taken: <br><span class="bold red">${
          test.timeTaken
        }</span> seconds</p>
        <p>You made <br><span class="bold red">${
          test.errorCount
        }</span> mistakes</p>
        <p>WPM <br><span class="bold red">${Math.floor(
          test.questionText.length / 5 / (test.timeTaken / 60)
        )}</span></p>
      </div>
    </div>
    `;

    histories.insertBefore(newRow, histories.firstChild);
  });
}
