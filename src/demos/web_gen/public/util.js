const promptElement = document.getElementById("prompt");
const makepromptButton = document.getElementById("makeprompt");

makepromptButton.addEventListener("click", () => {
  console.log("Generating a prompt...");

  const style = [
    "hyperrealistic",
    "surreal",
    "abstract",
    "noir",
    "cyberpunk",
    "minimalist",
  ];
  const media = [
    "photo",
    "painting",
    "sketch",
    "sculpture",
    "film still",
  ];
  const professions = [
    "Barista",
    "Chef",
    "Artist",
    "Photographer",
    "Firefighter",
    "Pilot",
    "Doctor",
    "Teacher",
    "Scientist",
    "Astronaut",
    "Athlete",
  ];

  const verbs = [
    "eating",
    "drinking",
    "sleeping",
    "running",
    "walking",
    "flying",
    "swimming",
    "cycling",
    "driving",
    "sailing",
    "hiking",
    "climbing",
  ];

  const prompt = //
    `${pick(style)} style ${pick(media)}. A ${pick(professions)} ${
      pick(verbs)
    }.`;

  console.log(prompt);
  promptElement.value = prompt;
});

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

makepromptButton.click();
