console.log("Hello, main.js");

const revisionTab = document.getElementById("revision-tab");
const diffTab = document.getElementById("diff-tab");

const originalInput = document.getElementById("original");
const instructionInput = document.getElementById("instruction");
const revisionDiv = document.getElementById("revision");
const diffDiv = document.getElementById("diff");

const submitButton = document.getElementById("submit");

async function onSubmit() {
  const instruction = instructionInput.value;
  const version1 = originalInput.value;
  const prompt =
    `revise the following text. return only the revised text. make no changes to the text unless the change is indicated by the following instructions: ${instruction}. \n\n${version1}`;

  revisionDiv.innerHTML = "loading...";
  diffDiv.innerHTML = "loading...";

  const version2 = await fetch(`/api/gpt?prompt=${encodeURIComponent(prompt)}`)
    .then((response) => response.text());

  revisionDiv.innerHTML = version2;
  updateDiff(version1, version2);
}

function updateDiff(version1, version2) {
  const diff = Diff.diffWords(version1, version2);
  diffDiv.innerHTML = "";
  diff.forEach((part) => {
    const className = part.added ? "added" : part.removed ? "removed" : "";
    const span = document.createElement("span");
    span.className = className;
    span.appendChild(document.createTextNode(part.value));
    diffDiv.appendChild(span);
  });
}

revisionTab.addEventListener("click", () => {
  console.log("revision-tab");
  revisionDiv.classList.remove("hidden");
  diffDiv.classList.add("hidden");
  revisionTab.classList.add("bg-gray-600");
  diffTab.classList.remove("bg-gray-600");
});

diffTab.addEventListener("click", () => {
  console.log("diff-tab");
  diffDiv.classList.remove("hidden");
  revisionDiv.classList.add("hidden");
  diffTab.classList.add("bg-gray-600");
  revisionTab.classList.remove("bg-gray-600");
});

submitButton.addEventListener("click", onSubmit);

originalInput.value =
  `It was a dark and stormy night; the rain fell in torrents—except at occasional intervals, when it was checked by a violent gust of wind which swept up the streets (for it is in London that our scene lies), rattling along the housetops, and fiercely agitating the scanty flame of the lamps that struggled against the darkness.`;

instructionInput.value = `add adjectives`;
