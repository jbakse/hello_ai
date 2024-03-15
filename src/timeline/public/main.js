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

// makeCards({
//   "cards": [
//     {
//       "title": "Newton's Laws of Motion",
//       "year": 1687,
//       "description": "Isaac Newton formulated his three laws of motion.",
//       "art": "Isaac Newton should be in a contemplative pose, holding an apple",
//     },
//     {
//       "title": "Theory of Evolution",
//       "year": 1859,
//       "description":
//         "Charles Darwin published his groundbreaking work 'On the Origin of Species.'",
//       "art": "Charles Darwin studies a finch",
//     },
//     {
//       "title": "Discovery of Penicillin",
//       "year": 1928,
//       "description":
//         "Alexander Fleming discovered the first antibiotic, penicillin, which revolutionized medicine.",
//       "art": "Alexander Fleming looking at a Petri dish",
//     },
//     {
//       "title": "The Structure of DNA",
//       "year": 1953,
//       "description":
//         "James Watson and Francis Crick described the double helix structure of DNA.",
//       "art": "Watson and Crick examining the DNA model",
//     },
//     {
//       "title": "The First Human in Space",
//       "year": 1961,
//       "description":
//         "Yuri Gagarin, a Soviet astronaut, became the first human to travel into space and orbit the Earth.",
//       "art": "Yuri Gagarin in his space suit, waving",
//     },
//   ],
// });
