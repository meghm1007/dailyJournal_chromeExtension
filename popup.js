document.addEventListener("DOMContentLoaded", function () {
  const calendarButton = document.getElementById("calendarButton");
  const calendarContainer = document.getElementById("calendarContainer");
  const goalsContainer = document.getElementById("goalsContainer");
  const settingsButton = document.getElementById("settingsButton");
  const downloadButtonPro = document.getElementById("downloadButton");

  // Function to check the date and button status daily
  function checkDailyJournalStatus() {
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
    const buttonId = `${months[currentMonth].substring(0, 3)}${currentDay}`;
    const button = document.getElementById(buttonId);

    const journalStatus = button && button.style.backgroundColor === "green";
    chrome.runtime.sendMessage({
      message: "journalAdded",
      date: buttonId,
      status: journalStatus,
    });
  }

  // Check daily journal status every day at midnight
  setInterval(checkDailyJournalStatus, 24 * 60 * 60 * 1000);

  // Initial check when the script runs
  checkDailyJournalStatus();

  // Retrieve the saved button IDs from local storage
  const savedButtonIds = JSON.parse(localStorage.getItem("buttonIds")) || [];

  settingsButton.addEventListener("click", () => {
    chrome.tabs.create({
      url: "settings.html",
    });
  });

  downloadButtonPro.addEventListener("click", () => {
    const goals_container = document.getElementById("goalsContainer");
    const goals_divs = goals_container.getElementsByTagName("div");
    const data = [];
    for (let i = 0; i < goals_divs.length; i++) {
      let sentence = goals_divs[i].innerText;
      let res = "";
      for (let j = 0; j < sentence.length; j++) {
        if (
          /^[a-zA-Z0-9\s~`!@#$%^&*()-_+={}[\]:;<>,.?/'"|\\]+$/.test(sentence[j])
        ) {
          res += sentence[j];
        }
      }
      data.push(res);
    }

    alert("Document Saved!");

    const dataString = data.join("\n"); // Use '\n' or any separator you prefer
    const file = new Blob([dataString], { type: "text" });
    const anchor = document.createElement("a");

    anchor.href = URL.createObjectURL(file);
    anchor.download = "save.txt";
    anchor.click();
  });

  calActive = false;

  calendarButton.addEventListener("click", function () {
    calActive = !calActive;
    calendarButton.innerText = calActive ? "Hide Calendar" : "Show Calendar";
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

    let calendarHTML = "<table>";
    calendarHTML +=
      "<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>";

    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let dayCounter = 1; // January 1st, 2024, is a Monday

    for (let i = 0; i < 12; i++) {
      calendarHTML += `<tr><th colspan="7">${months[i]}</th></tr>`;
      calendarHTML += "<tr>";

      const firstDayOfMonth = dayCounter % 7;
      for (let k = 0; k < firstDayOfMonth; k++) {
        calendarHTML += "<td></td>";
      }

      for (let j = 1; j <= daysInMonth[i]; j++) {
        if (dayCounter % 7 === 0) {
          calendarHTML += "</tr><tr>";
        }

        const isCurrentMonth = i === currentMonth;
        const isPastDay =
          i < currentMonth || (i === currentMonth && j < currentDate.getDate());
        const buttonDisabled = !isCurrentMonth || isPastDay;
        const titleText = buttonDisabled
          ? "You cannot add dreams for this day"
          : "";
        const buttonId = `${months[i].substring(0, 3)}${j}`;
        const isSavedButton = savedButtonIds.includes(buttonId);

        calendarHTML += `<td><button id="${buttonId}" class="dayButton" data-month="${i}" data-day="${j}" ${
          buttonDisabled ? "disabled" : ""
        } title="${titleText}" style="background-color: ${
          isSavedButton ? "green" : ""
        };">${j}</button></td>`;
        dayCounter++;

        if (dayCounter > 7) {
          dayCounter = 1;
        }
      }

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

    dayButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const buttonId = `${months[button.dataset.month].substring(0, 3)}${
          button.dataset.day
        }`;

        const modal = document.createElement("div");
        modal.className = "goal-modal";
        const goalInput = document.createElement("textarea");
        goalInput.placeholder = "Journal at least 100 words today...";
        goalInput.className = "goal-input";
        const saveButton = document.createElement("button");
        saveButton.innerText = "Save";
        saveButton.className = "save-btn";
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.className = "delete-btn";
        modal.appendChild(goalInput);
        modal.appendChild(saveButton);
        modal.appendChild(deleteButton);
        document.body.appendChild(modal);
        goalInput.focus();

        saveButton.addEventListener("click", function () {
          button.style.backgroundColor = "green";
          savedButtonIds.push(buttonId); // Add button ID to savedButtonIds
          localStorage.setItem("buttonIds", JSON.stringify(savedButtonIds)); // Save the updated button IDs to local storage

          const userGoal = goalInput.value.trim();
          const wordCount = userGoal
            .split(/\s+/)
            .filter((word) => word.length > 0).length;

          if (wordCount < 100) {
            alert("Please enter at least 100 words.");
            return;
          }

          goalsContainer.scrollIntoView({ behavior: "smooth" });

          const goalDate = `${months[button.dataset.month]} ${
            button.dataset.day
          }`;

          const storedGoals = JSON.parse(localStorage.getItem("goals")) || [];
          storedGoals.push({ date: goalDate, goal: userGoal });
          localStorage.setItem("goals", JSON.stringify(storedGoals));

          const goalElement = document.createElement("div");
          goalElement.className = "goal";
          goalElement.innerHTML = `<span>${goalDate}:</span> ${userGoal}`;

          const goalDeleteButton = document.createElement("button");
          goalDeleteButton.innerText = "🗑️";
          goalDeleteButton.className = "delete-goal-btn";
          goalDeleteButton.addEventListener("click", function () {
            const updatedGoals = storedGoals.filter(
              (goal) => goal.date !== goalDate
            );
            localStorage.setItem("goals", JSON.stringify(updatedGoals));
            goalsContainer.removeChild(goalElement);
            savedButtonIds.splice(savedButtonIds.indexOf(buttonId), 1); // Remove button ID from savedButtonIds
            localStorage.setItem("buttonIds", JSON.stringify(savedButtonIds)); // Update local storage
            button.style.backgroundColor = ""; // Reset button color
            checkDailyJournalStatus(); // Update journal status after deletion
          });

          goalElement.appendChild(goalDeleteButton);
          goalsContainer.appendChild(goalElement);
          document.body.removeChild(modal);
          checkDailyJournalStatus(); // Update journal status after saving
        });

        deleteButton.addEventListener("click", function () {
          document.body.removeChild(modal);
        });
      });

      if (
        button.hasAttribute("disabled") &&
        button.style.backgroundColor !== "green"
      ) {
        button.style.background = "#ddd";
        button.style.opacity = "0.6";
        button.style.cursor = "not-allowed";
      }
    });
  }

  function loadStoredGoals() {
    const storedGoals = JSON.parse(localStorage.getItem("goals")) || [];
    storedGoals.forEach((goal) => {
      const { date, goal: text } = goal;
      const goalElement = document.createElement("div");
      goalElement.className = "goal";
      goalElement.innerHTML = `<span>${date}:</span> ${text}`;

      const goalDeleteButton = document.createElement("button");
      goalDeleteButton.innerText = "🗑️";
      goalDeleteButton.className = "delete-goal-btn";
      goalDeleteButton.addEventListener("click", function () {
        const updatedGoals = storedGoals.filter((g) => g.date !== date);
        localStorage.setItem("goals", JSON.stringify(updatedGoals));
        goalsContainer.removeChild(goalElement);
        savedButtonIds.splice(savedButtonIds.indexOf(buttonId), 1); // Remove button ID from savedButtonIds
        localStorage.setItem("buttonIds", JSON.stringify(savedButtonIds)); // Update local storage
        const button = document.getElementById(buttonId);
        if (button) {
          button.style.backgroundColor = ""; // Reset button color
        }
        checkDailyJournalStatus(); // Update journal status after deletion
      });

      goalElement.appendChild(goalDeleteButton);
      goalsContainer.appendChild(goalElement);
    });
  }

  loadStoredGoals();

  settingsButton.addEventListener("click", () => {
    chrome.tabs.create({
      url: "settings.html",
    });
  });

  chrome.storage.sync.get("settings", function (result) {
    const savedSettings = result.settings;
    if (savedSettings) {
      console.log("Retrieved Settings:", savedSettings);
    }
  });

  function extractDatesFromGoalsContainer() {
    const scores_array = [];
    const goals_container2 = document.getElementById("goalsContainer");
    const goals_divs2 = goals_container2.getElementsByTagName("div");
    for (let i = 0; i < goals_divs2.length; i++) {
      let sentence = goals_divs2[i].innerText;
      const scoreIndex = sentence.indexOf("Score: ");
      const score = sentence.substring(scoreIndex + 7, sentence.length - 4);
      const intScore = parseInt(score, 10);
      scores_array.push(intScore);
    }
    console.log(scores_array);

    const goalsContainer = document.getElementById("goalsContainer");
    const goalElements = goalsContainer.querySelectorAll("div.goal");
    const dateArray = [];
    const dateRegex =
      /(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d+)/;

    goalElements.forEach((goalElement) => {
      const spanElement = goalElement.querySelector("span");
      if (spanElement) {
        const match = dateRegex.exec(spanElement.innerText);
        if (match) {
          const formattedDate = match[0].replace(/\s/g, "");
          dateArray.push(formattedDate);
        }
      }
    });

    const dayButtons = document.querySelectorAll(".dayButton");
    dayButtons.forEach((button) => {
      const buttonId = button.id;
      if (dateArray.includes(buttonId)) {
        button.style.backgroundColor = "green";
        button.style.color = "white";
      }
    });

    console.log(dateArray);
  }

  extractDatesFromGoalsContainer();

  const goals_container = document.getElementById("goalsContainer");
  const goals_divs = goals_container.getElementsByTagName("div");
  for (let i = 0; i < goals_divs.length; i++) {
    const sentenceBG = goals_divs[i];
    let sentence = goals_divs[i].innerText;
    sentence = sentence.split(":")[1].trim();
    sentence = sentence.replace(/\n🗑️$/, "");
    const colorr = sentimentAnalysis(sentence);
    sentenceBG.style.backgroundColor = colorr;
  }

  function makeScoreArray() {}
});
