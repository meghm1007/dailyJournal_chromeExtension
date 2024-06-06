// const urls = ["example.com", "anotherdomain.com"]; // Add your URLs here
// let journal_status = false; // Initialize journal_status as false

// // Listener to receive the journal status message
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.journalStatus !== undefined) {
//     // Update the journal_status with the received value
//     journal_status = message.journalStatus;

//     console.log("Journal status received in content script:", journal_status);

//     // Optionally, send a response back to the sender
//     sendResponse({ status: "Journal status processed in content script" });

//     // Check if the current site should be blocked after receiving the journal status
//     checkAndBlockSite();
//   }
// });

// // Function to check and block/unblock the site if needed
// function checkAndBlockSite() {
//   if (journal_status === true) {
//     // If journal status is true, clear the blocking content
//     console.log("Journal status is true, so the website is not blocked");
//     const blockedContainer = document.getElementById("blocked-container");
//     if (blockedContainer) {
//       blockedContainer.remove();
//       document.body.style.backgroundColor = ""; // Reset the background color
//     }
//   } else if (!urls.includes(window.location.hostname) && !journal_status) {
//     // If journal status is false and the current hostname is not in the URLs list, block the site
//     console.log("Journal status is false, blocking the website");
//     document.body.innerHTML = `
//       <div id="blocked-container">
//           <h1 id="website-title">Website is blocked</h1>
//           <p id="journal-message">Sorry, this website is blocked as you did not journal today</p>
//           <p id="journal-message-controls">Use <span id="control-text">ctrl + alt + J</span> or click on the extension icon to journal now</p>
//       </div>`;
//     document.body.style.backgroundColor = "black";
//   }
// }

// // Initial check in case the message is received after the page load
// checkAndBlockSite();
