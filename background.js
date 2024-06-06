chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.journalStatus !== undefined) {
    // Store the value of journalStatus in a variable
    const journalStatus = request.journalStatus;
    console.log("Journal status received in background script:", journalStatus);

    // Optionally, you can send a response back
    sendResponse({ status: "Journal status stored" });
  }
});

chrome.commands.onCommand.addListener(function (command) {
  if (command === "_execute_browser_action") {
    chrome.action.openPopup();
  }
});

// chrome.runtime.sendMessage({
//   message: "journalAdded",
//   date: buttonId,
//   status: journalStatus,
// });
