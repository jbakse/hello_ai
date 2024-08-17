console.log("Hello, Web Gen!");

const promptElement = document.getElementById("prompt");

document.getElementById("openai-dalle3").addEventListener("click", () => {
  const prompt = promptElement.value || "no prompt";
  console.log("openai-dalle3 clicked");
  fetch(`/api/openai/dalle3?prompt=${prompt}`)
    .then((response) => response.text())
    .then((url) => {
      addImage(url, prompt, "OpenAI Dall•e 3");
    });
});

document.getElementById("fal-cascade").addEventListener("click", () => {
  const prompt = promptElement.value || "no prompt";
  console.log("fal-cascade clicked");
  fetch(`/api/fal/cascade?prompt=${prompt}`)
    .then((response) => response.text())
    .then((url) => {
      addImage(url, prompt, "fal Cascade");
    });
});

document.getElementById("fal-lightning").addEventListener("click", () => {
  const prompt = promptElement.value || "no prompt";
  console.log("fal-lightning clicked");
  fetch(`/api/falfast?prompt=${prompt}`)
    .then((response) => response.text())
    .then((url) => {
      addImage(url, prompt, "fal Lightning");
    });
});

function addImage(url, prompt, model) {
  const e = document.createElement("div");

  e.innerHTML = `
  <div class="mb-4">
    <img class="block" src="${url}" />
    <div class="p-4 bg-gray-500 text-white w-1/2">${prompt}</div>
    <div class="p-4 bg-red-500 text-white w-1/4">${model}</div>
  </div>
  `;
  const output = document.getElementById("output");
  output.insertBefore(e, output.firstChild);
}
