chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarize",
    title: "Summarize Text",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "summarizeDrunk",
    title: "Summarize Text by Drunk AI",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "summarizePhilosophical",
    title: "Summarize Text by philosophical AI",
    contexts: ["selection"],
  });
});
const is_local = false;
const url = is_local ? "http://localhost:4000/aiWrapper" : "<YOUR_BACKEND_URL>";

function sendRequestDirectlyAndDisplaySummary(selectedText, prompt, tab) {
  fetch(`https://api.openai.com/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer <YOUR_OPENAI_API_KEY>`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: selectedText,
        },
      ],
      temperature: 0.7,
      max_tokens: 128,
      top_p: 1,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Summary:", data.summary);
      const summary = data.choices[0].message.content;
      console.log("Summary:", summary);
      chrome.tabs.sendMessage(tab.id, {
        action: "displaySummary",
        summary: summary,
      });
    })
    .catch((error) => console.error("Error:", error));
}
function sendRequestToBackendAndDisplaySummary(selectedText, prompt, tab) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemPrompt: prompt,
      userInput: selectedText,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Summary:", data);
      chrome.tabs.sendMessage(tab.id, {
        action: "displaySummary",
        summary: data,
      });
    })
    .catch((error) => console.error("Error:", error));
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarize") {
    const selectedText = info.selectionText;
    // Call your API with the selected text
    sendRequestToBackendAndDisplaySummary(
      selectedText,
      "Summarize those product comments in english language.",
      tab
    );
  }
  if (info.menuItemId === "summarizeDrunk") {
    const selectedText = info.selectionText;
    // Call your API with the selected text
    sendRequestToBackendAndDisplaySummary(
      selectedText,
      "Summarize those product comments in english language as a drunk man who likes to explain everything using whiskey.",
      tab
    );
  }
  if (info.menuItemId === "summarizePhilosophical") {
    const selectedText = info.selectionText;
    // Call your API with the selected text
    sendRequestToBackendAndDisplaySummary(
      selectedText,
      "Summarize those product comments in english language as a philosopher who likes to explain everything using philosophy.",
      tab
    );
  }
});
