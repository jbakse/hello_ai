console.log("hi");

// set content of #random-number to response from /api/randomInt
// using await

async function setRandomNumber() {
  const response = await fetch("/api/randomInt");
  const number = await response.text();
  document.getElementById("random-number").textContent = number;
}

async function setHits() {
  const response = await fetch("/api/hits");
  const number = await response.text();
  document.getElementById("hits").textContent = number;
}

setRandomNumber();
setHits();
