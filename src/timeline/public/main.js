const promptElement = document.getElementById("prompt");
const sendElement = document.getElementById("send");
sendElement.addEventListener("click", () => {
  fetch(`/api/cards?prompt=${promptElement.value}`)
    .then((response) => response.json())
    .then(makeCards);
});

function makeCards(data) {
  const cardsElement = document.getElementById("cards");

  for (const card of data.cards) {
    const cardElement = htmlToElement(`
    <div class="card">
        <img class="art" src="./empty.png">
        <div class="gradient"></div>
        <img class="background" src="./card.png">
        <div class="title">${card.title}</div>
        <div class="year">${card.year}</div>
        <div class="gradient-2"></div>
    </div>
   `);
    cardsElement.appendChild(cardElement);
    addCardArt(cardElement, card.art);
  }
}

function addCardArt(cardElement, prompt) {
  console.log("start", cardElement, prompt);
  fetch(`/api/art?prompt=${encodeURIComponent(prompt)}`)
    .then((response) => response.text())
    .then((url) => {
      console.log("then", cardElement, prompt, url);
      const artElement = cardElement.querySelector(".art");
      artElement.src = url;
    });
}

function htmlToElement(html) {
  html = html.trim();
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.children[0];
}
