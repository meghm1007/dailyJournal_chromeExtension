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