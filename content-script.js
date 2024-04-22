function createFloatingPopup(summary) {
  // Remove existing popup if it exists
  let existingPopup = document.getElementById("summary-popup");
  if (existingPopup) {
    existingPopup.remove();
  }

  // Create the popup element
  let popup = document.createElement("div");
  popup.id = "summary-popup";
  popup.style.position = "fixed";
  popup.style.bottom = "20px";
  popup.style.right = "20px";
  popup.style.padding = "10px";
  popup.style.background = "white";
  popup.style.border = "1px solid black";
  popup.style.borderRadius = "5px";
  popup.style.zIndex = "1000";

  // Add text to the popup
  popup.textContent = summary;

  // Append the popup to the body
  document.body.appendChild(popup);

  // Remove the popup after some time or on click
  popup.addEventListener("click", function () {
    popup.remove();
  });
  setTimeout(() => popup.remove(), 10000); // auto-remove after 10 seconds
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "displaySummary" && request.summary) {
    createFloatingPopup(request.summary);
  }
});
