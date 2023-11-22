const messages = [];

async function setup() {
  const inputField = document.getElementById("inputField");
  inputField.addEventListener("keydown", handleEnter);

  const response = await gptChat(
    "You meet the adventurer for the first time. Greet them and tell them about your problem.",
  );

  appendToLog(response, "bot-message");
}
setup();

async function handleEnter(event) {
  if (event.key === "Enter") {
    const inputField = document.getElementById("inputField");
    const prompt = inputField.value;
    inputField.value = "";
    appendToLog(prompt, "user-message");
    const response = await gptChat(prompt);
    appendToLog(response, "bot-message");
  }
}

function appendToLog(message, className) {
  const logDiv = document.getElementById("log");

  const messageDiv = document.createElement("div");

  messageDiv.classList.add("message", className);

  messageDiv.innerHTML = `<div class='text'>${message}</div>`;

  // add text-effect class to all spans in messageDiv
  const spans = messageDiv.getElementsByTagName("span");
  for (const span of spans) {
    span.classList.add("text-effect");
  }
  initTextEffects(messageDiv);

  logDiv.appendChild(messageDiv);
  logDiv.scrollTop = logDiv.scrollHeight;
}

async function gptChat(prompt) {
  try {
    messages.push({ role: "user", content: prompt });
    const response = await fetch("/gptChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log(responseText);

    messages.push({ role: "assistant", content: responseText });

    return responseText;
  } catch (error) {
    console.error("Error:", error);
    return `Error: ${error.message}`;
  }
}

// async function gptPrompt(prompt) {
//   try {
//     const response = await fetch("/gpt", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ prompt }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.text();
//   } catch (error) {
//     console.error("Error:", error);
//     return `Error: ${error.message}`;
//   }
// }
