console.log("Woodland Sprite");

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

const name = pick(names);

const messages = [];

async function setup() {
  const inputField = document.getElementById("inputField");
  inputField.addEventListener("keydown", onKeydown);

  let response = await spriteChat(
    "You meet the adventurer for the first time. Greet them and tell them about your problem.",
  );
  response = response.slice(0, -1);
  showMessage("bot", response, "/images/sprite_sad.png");
}
setup();

async function onKeydown(event) {
  if (event.key !== "Enter") return;

  // read prompt
  const inputField = document.getElementById("inputField");
  const userMessage = inputField.value;

  // clear input field
  inputField.value = "";

  // show user message
  showMessage("user", userMessage);

  // send message to spriteChat API
  let response = await spriteChat(userMessage);

  // get code from end of response
  const code = response.slice(-1);

  // get response without code
  response = response.slice(0, -1).trim();

  let imgURL = undefined;
  if (code === "a") imgURL = "/images/sprite_angry.png";
  if (code === "e") imgURL = "/images/sprite_embarrassed.png";
  if (code === "h") imgURL = "/images/sprite_happy.png";
  if (code === "s") imgURL = "/images/sprite_sad.png";
  if (code === "r") imgURL = "/images/sprite_surprised.png";

  showMessage("bot", response, imgURL);
}

function showMessage(name, message, imageURL) {
  const chatDiv = document.getElementById("chat");

  let imageHTML = "";
  if (imageURL) {
    imageHTML = `<img class="avatar" src="${imageURL}">`;
  }

  const messageHTML = `
    <div class="message ${name}-message">
      ${imageHTML}
      <div class="text">${message}</div>
    </div>
  `;

  const messageDiv = elementFromString(messageHTML);

  // add text-effect class to all spans in messageDiv
  const spans = messageDiv.getElementsByTagName("span");
  for (const span of spans) {
    span.classList.add("text-effect");
  }
  initTextEffects(messageDiv);

  // add new message and scroll to bottom
  chatDiv.appendChild(messageDiv);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

async function spriteChat(prompt) {
  try {
    // add prompt to messages
    messages.push({ role: "user", content: prompt });

    // get response from server api
    const response = await fetch("/spriteChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages, name }),
    });

    // check for error
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // add response to messages
    const responseText = await response.text();
    messages.push({ role: "assistant", content: responseText });

    // return response
    return responseText;
  } catch (error) {
    console.error("Error:", error);
    return `Error: ${error.message}`;
  }
}

// pick - choose a random item from array
function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// elementFromString - create an element from an HTML string
function elementFromString(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}
