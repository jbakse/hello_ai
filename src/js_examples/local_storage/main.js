console.log("Hello from main.js");
console.log("Local storage: ", localStorage);
const saveButton = document.getElementById("save");
const inputField = document.getElementById("input");

inputField.value = localStorage.getItem("savedValue") ?? "nothing saved yet";

saveButton.addEventListener("click", () => {
  const value = inputField.value;
  console.log("Saving value: ", value);
  localStorage.setItem("savedValue", value);
});
