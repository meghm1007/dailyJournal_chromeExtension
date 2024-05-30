chrome.storage.sync.get("journalStatus", function (data) {
  const journalStatus = data.journalStatus;
  checkBlockingStatus(journalStatus);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "journalAdded") {
    checkBlockingStatus(request.status);
  }
});

function checkBlockingStatus(isJournalAddedToday) {
  const urls = ["example.com", "anotherexample.com"]; // Add your URLs here

  if (!urls.includes(window.location.hostname) && !isJournalAddedToday) {
    document.body.innerHTML = `
      <div id="blocked-container">
          <h1 id="website-title">Website is blocked</h1> 
          <p id="journal-message">Sorry, this website is blocked as you did not journal today</p>
          <p id="journal-message-controls">Use <span id="control-text">ctrl + alt + J</span> or click on the extension icon to journal now</p>
      </div>`;
    document.body.style.backgroundColor = "black";
  }
}
