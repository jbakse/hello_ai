const names = [
  "leaf",
  "nut",
  "twig",
  "blossom",
  "berry",
  "bark",
  "branch",
  "root",
  "sap",
  "seed",
  "sprout",
  "trunk",
];

const name = names[Math.floor(Math.random() * names.length)];

const messages = [];

async function setup() {
  const inputField = document.getElementById("inputField");
  inputField.addEventListener("keydown", handleEnter);

  let response = await spriteChat(
    "You meet the adventurer for the first time. Greet them and tell them about your problem.",
  );
  response = response.slice(0, -1);
  appendToChat(response, "bot-message", "/images/sprite_sad.png");
}
setup();

async function handleEnter(event) {
  if (event.key === "Enter") {
    const inputField = document.getElementById("inputField");
    const prompt = inputField.value;
    inputField.value = "";
    appendToChat(prompt, "user-message");
    let response = await spriteChat(prompt);

    // remove last letter from response
    const code = response.slice(-1);
    response = response.slice(0, -1);

    console.log("code", code);

    let imgURL = undefined;
    if (code === "a") imgURL = "/images/sprite_angry.png";
    if (code === "e") imgURL = "/images/sprite_embarrassed.png";
    if (code === "h") imgURL = "/images/sprite_happy.png";
    if (code === "s") imgURL = "/images/sprite_sad.png";
    if (code === "r") imgURL = "/images/sprite_surprised.png";

    appendToChat(response, "bot-message", imgURL);
  }
}

function appendToChat(message, className, imageURL) {
  const chatDiv = document.getElementById("chat");

  const messageDiv = document.createElement("div");

  messageDiv.classList.add("message", className);

  messageDiv.innerHTML = `<div class='text'>${message}</div>`;

  console.log("imageURL", imageURL);
  if (imageURL) {
    const image = document.createElement("img");

    image.classList.add("avatar");
    image.src = imageURL;
    //messageDiv.appendChild(image);
    messageDiv.prepend(image);
  }

  // add text-effect class to all spans in messageDiv
  const spans = messageDiv.getElementsByTagName("span");
  for (const span of spans) {
    span.classList.add("text-effect");
  }
  initTextEffects(messageDiv);

  chatDiv.appendChild(messageDiv);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

async function spriteChat(prompt) {
  try {
    messages.push({ role: "user", content: prompt });
    console.log("sending messages");
    console.log(messages);
    const response = await fetch("/spriteChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages, name }),
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
