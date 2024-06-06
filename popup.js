document.addEventListener("DOMContentLoaded", function () {
  const calendarButton = document.getElementById("calendarButton");
  const calendarContainer = document.getElementById("calendarContainer");
  const goalsContainer = document.getElementById("goalsContainer");
  const settingsButton = document.getElementById("settingsButton");
  const downloadButtonPro = document.getElementById("downloadButton");

  settingsButton.addEventListener("click", () => {
    chrome.tabs.create({
      url: "settings.html",
    });
  });

  downloadButtonPro.addEventListener("click", () => {
    var goals_container = document.getElementById("goalsContainer");
    var goals_divs = goals_container.getElementsByTagName("div");
    var data = [];
    for (i = 0; i < goals_divs.length; i++) {
      sentence = goals_divs[i].innerText;
      res = "";
      for (j = 0; j < sentence.length; j++) {
        if (
          /^[a-zA-Z0-9\s~`!@#$%^&*()-_+={}[\]:;<>,.?/'"|\\]+$/.test(
            sentence[j]
          ) == true
        ) {
          res += sentence[j];
        }
      }
      data.push(res);
    }
    //data = ['sample text 1', 'sample text 2', 'sample text 3']

    alert("Document Saved!");

    var dataString = data.join("\n"); // Use '\n' or any separator you prefer

    var file = new Blob([dataString], {
      type: "text",
    });
    var anchor = document.createElement("a");

    anchor.href = URL.createObjectURL(file);
    anchor.download = "save.txt";

    anchor.click();
  });

  calActive = false;

  calendarButton.addEventListener("click", function () {
    calActive = !calActive;
    if (calActive) {
      calendarButton.innerText = "Hide Calendar";
    } else {
      calendarButton.innerText = "Show Calendar";
    }
    toggleCalendar();
    generateCalendar();
  });

  function toggleCalendar() {
    calendarContainer.style.display =
      calendarContainer.style.display === "none" ||
      calendarContainer.style.display === ""
        ? "block"
        : "none";
  }

  function generateCalendar() {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const calendarContainer = document.getElementById("calendarContainer"); // Assuming calendarContainer is defined

    let calendarHTML = "<table>";
    calendarHTML +=
      "<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>";

    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let dayCounter = 1; // January 1st, 2024, is a Monday

    for (let i = 0; i < 12; i++) {
      calendarHTML += `<tr><th colspan="7">${months[i]}</th></tr>`;
      calendarHTML += "<tr>";

      // Calculate the number of empty cells before the 1st day of the month
      const firstDayOfMonth = dayCounter % 7;
      for (let k = 0; k < firstDayOfMonth; k++) {
        calendarHTML += "<td></td>";
      }

      // Generate the days of the month as smaller buttons
      for (let j = 1; j <= daysInMonth[i]; j++) {
        if (dayCounter % 7 === 0) {
          calendarHTML += "</tr><tr>";
        }

        const isCurrentMonth = i === currentMonth;
        const isPastDay =
          i < currentMonth || (i === currentMonth && j < currentDate.getDate());
        const buttonDisabled = !isCurrentMonth || isPastDay;

        // Add title attribute to disabled buttons
        const titleText = buttonDisabled
          ? "You cannot add dreams for this day"
          : "";

        const buttonId = `${months[i].substring(0, 3)}${j}`;
        calendarHTML += `<td><button id="${buttonId}" class="dayButton" data-month="${i}" data-day="${j}" ${
          buttonDisabled ? "disabled" : ""
        } title="${titleText}">${j}</button></td>`;
        dayCounter++;

        if (dayCounter > 7) {
          dayCounter = 1;
        }
      }

      // Calculate the remaining empty cells after the last day of the month
      const remainingEmptyCells = 7 - (dayCounter - 1);
      for (let m = 0; m < remainingEmptyCells; m++) {
        calendarHTML += "<td></td>";
      }

      calendarHTML += "</tr>";
    }

    calendarHTML += "</table>";
    calendarContainer.innerHTML = calendarHTML;
    const dayButtons = document.querySelectorAll(".dayButton");
    dayButtons.forEach((button) => {
      button.style.fontSize = "10px";
      button.style.padding = "3px 6px";
    });

    // Attach event listeners to the day buttons
    dayButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const buttonId = `${months[button.dataset.month].substring(0, 3)}${
          button.dataset.day
        }`;

        // Create a custom modal for goal input
        const modal = document.createElement("div");
        modal.className = "goal-modal";

        // Create goal input field
        const goalInput = document.createElement("textarea");
        goalInput.placeholder =
          "Enter your journal for today, Add a score of how you feel between 1-100";
        goalInput.className = "goal-input";

        // Create a score slider
        const scoreSlider = document.createElement("input");
        scoreSlider.type = "range";
        scoreSlider.min = 1;
        scoreSlider.max = 100;
        scoreSlider.value = 50; // Initial value
        scoreSlider.className = "score-slider";
        scoreSlider.style.backgroundColor = "red";

        // Display the selected score
        const scoreDisplay = document.createElement("span");
        scoreDisplay.innerText = scoreSlider.value;
        scoreDisplay.className = "score-display";

        // Create save button
        const saveButton = document.createElement("button");
        saveButton.innerText = "Save";
        saveButton.className = "save-btn";

        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.className = "delete-btn";

        // Append input, slider, buttons, and score display to modal
        modal.appendChild(goalInput);
        modal.appendChild(scoreSlider);
        modal.appendChild(scoreDisplay);
        modal.appendChild(saveButton);
        modal.appendChild(deleteButton);

        // Append modal to body
        document.body.appendChild(modal);

        // Focus on the input field
        goalInput.focus();

        // Add event listener to update score display
        scoreSlider.addEventListener("input", function () {
          scoreDisplay.innerText = scoreSlider.value;
        });

        // Add event listener to save button
        saveButton.addEventListener("click", function () {
          const userGoal = goalInput.value.trim();
          const userScore = scoreSlider.value;
          const goalsContainer = document.getElementById("goalsContainer"); // Assuming goalsContainer is defined

          const wordCount = userGoal
            .split(/\s+/)
            .filter((word) => word.length > 0).length;

          if (wordCount < 100) {
            alert("Please enter at least 100 words.");
            return;
          }
          goalsContainer.scrollIntoView({
            behavior: "smooth",
          });

          if (userGoal) {
            const goalDate = `${months[button.dataset.month]} ${
              button.dataset.day
            }`;

            // Store the goal and score in local storage
            const storedGoals = JSON.parse(localStorage.getItem("goals")) || [];
            storedGoals.push({
              date: goalDate,
              goal: userGoal,
              score: userScore,
            });
            localStorage.setItem("goals", JSON.stringify(storedGoals));

            // Create a new element to display the goal and score
            const goalElement = document.createElement("div");
            goalElement.className = "goal";
            goalElement.innerHTML = `<span>${goalDate}:</span> ${userGoal},  <strong><em>Score: ${userScore}</em></strong>`;

            // Create delete button for the goal
            const goalDeleteButton = document.createElement("button");
            goalDeleteButton.innerText = "🗑️";
            goalDeleteButton.className = "delete-goal-btn";

            // Add event listener to the delete button
            goalDeleteButton.addEventListener("click", function () {
              // Remove the goal from local storage
              const updatedGoals = storedGoals.filter(
                (goal) => goal.date !== goalDate
              );
              localStorage.setItem("goals", JSON.stringify(updatedGoals));

              // Remove the goal element when the delete button is clicked
              goalsContainer.removeChild(goalElement);
            });

            // Append the delete button to the goal element
            goalElement.appendChild(goalDeleteButton);

            // Append the goal to the goalsContainer
            goalsContainer.appendChild(goalElement);
          }

          // Close the modal
          document.body.removeChild(modal);
        });

        // Add event listener to delete button
        deleteButton.addEventListener("click", function () {
          // Close the modal without saving
          document.body.removeChild(modal);
        });
      });

      if (button.hasAttribute("disabled")) {
        button.style.background = "#ddd";
        button.style.opacity = "0.6";
        button.style.cursor = "not-allowed";
      }
    });

    style.opacity = "0.6";
  }

  // Load stored goals from local storage on page load
  function loadStoredGoals() {
    const storedGoals = JSON.parse(localStorage.getItem("goals")) || [];

    storedGoals.forEach((goal) => {
      const { date, goal: text, score } = goal; // Include 'score' property

      // Create a new element to display the goal with score
      const goalElement = document.createElement("div");
      goalElement.className = "goal";
      goalElement.innerHTML = `<span>${date}:</span> ${text}, <strong><em>Score: ${score}</strong></em>`;

      // Create delete button for the goal
      const goalDeleteButton = document.createElement("button");
      goalDeleteButton.innerText = "🗑️";
      goalDeleteButton.className = "delete-goal-btn";

      // Add event listener to the delete button
      goalDeleteButton.addEventListener("click", function () {
        // Remove the goal from local storage
        const updatedGoals = storedGoals.filter((g) => g.date !== date);
        localStorage.setItem("goals", JSON.stringify(updatedGoals));

        // Remove the goal element when the delete button is clicked
        goalsContainer.removeChild(goalElement);
      });

      // Append the delete button to the goal element
      goalElement.appendChild(goalDeleteButton);

      // Append the goal to the goalsContainer
      goalsContainer.appendChild(goalElement);
    });
  }

  // Call the function to load stored goals on page load
  loadStoredGoals();

  settingsButton.addEventListener("click", () => {
    chrome.tabs.create({
      url: "settings.html",
    });
  });

  // Retrieve the settings from chrome.storage when the popup is opened

  const dateArray = [];

  function extractDatesFromGoalsContainer() {
    const scores_array = [];
    var goals_container2 = document.getElementById("goalsContainer");
    var goals_divs2 = goals_container2.getElementsByTagName("div");
    for (i = 0; i < goals_divs2.length; i++) {
      sentence = goals_divs2[i].innerText;
      const scoreIndex = sentence.indexOf("Score: ");
      const score = sentence.substring(scoreIndex + 7, sentence.length - 4);
      const intScore = parseInt(score, 10);
      scores_array.push(intScore);
    }

    const goalsContainer = document.getElementById("goalsContainer");
    const goalElements = goalsContainer.querySelectorAll("div.goal");

    const dateRegex =
      /(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d+)/;

    goalElements.forEach((goalElement) => {
      const spanElement = goalElement.querySelector("span");
      if (spanElement) {
        const match = dateRegex.exec(spanElement.innerText);
        if (match) {
          const formattedDate = match[0].replace(/\s/g, ""); // Remove spaces from the date
          dateArray.push(formattedDate);
        }
      }
    });

    const dayButtons = document.querySelectorAll(".dayButton");

    dayButtons.forEach((button) => {
      const buttonId = button.id;

      // Check if buttonId is in dateArray
      if (dateArray.includes(buttonId)) {
        // Change the color of the button to green
        button.style.backgroundColor = "green";
        button.style.color = "white"; // You can adjust text color as needed
      }
    });
  }
  // Call the function to extract dates from the goalsContainer on page load
  extractDatesFromGoalsContainer();
  console.log(dateArray); // You can store or use the dateArray as needed

  //Turn buttons green if journal for that day has been added
  function buttonColorDateJournalAdded() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const journalHeader = document.getElementById("isJournalHeader");
    const buttonId = `${months[currentMonth].substring(0, 3)}${currentDay}`;
    console.log(buttonId);
    //check if buttonId is in dateArray
    if (dateArray.includes(buttonId)) {
      const journalStatus = true;
      console.log("Journal status", journalStatus);
      journalHeader.innerText = "Journal For Today✅";
    }
  }

  var goals_container = document.getElementById("goalsContainer");
  var goals_divs = goals_container.getElementsByTagName("div");
  for (i = 0; i < goals_divs.length; i++) {
    sentenceBG = goals_divs[i];
    sentence = goals_divs[i].innerText;
    sentence = sentence.split(":")[1].trim();
    sentence = sentence.replace(/\n🗑️$/, "");
  }
  buttonColorDateJournalAdded();
});
