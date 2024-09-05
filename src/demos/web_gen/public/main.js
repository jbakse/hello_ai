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
  fetch(`/api/fal/lightning?prompt=${prompt}`)
    .then((response) => response.text())
    .then((url) => {
      addImage(url, prompt, "fal Lightning");
    });
});

document.getElementById("fal-aura").addEventListener("click", () => {
  const prompt = promptElement.value || "no prompt";
  console.log("fal-aura clicked");
  fetch(`/api/fal/aura?prompt=${prompt}`)
    .then((response) => response.text())
    .then((url) => {
      addImage(url, prompt, "fal aura");
    });
});

document.getElementById("fal-flux").addEventListener("click", () => {
  const prompt = promptElement.value || "no prompt";
  console.log("fal-flux clicked");
  fetch(`/api/fal/flux?prompt=${prompt}`)
    .then((response) => response.text())
    .then((url) => {
      addImage(url, prompt, "fal flux");
    });
});

function addImage(url, prompt, model) {
  const e = document.createElement("a");

  e.setAttribute("data-fslightbox", "lightbox");
  e.setAttribute("data-caption", `<h1>${prompt}</h1>`);
  e.href = url;
  e.innerHTML = `

  <div class="w-96 mb-4 mr-4">
    <img class="block" src="${url}" />
    <div class="p-4 bg-gray-500 text-white">${prompt}</div>
    <div class="p-4 bg-red-500 text-white 2-48">${model}</div>
  </div>
  `;
  const output = document.getElementById("output");
  output.insertBefore(e, output.firstChild);

  refreshFsLightbox();
}
