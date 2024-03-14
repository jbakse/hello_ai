// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

console.log("Hi");

// lets tart with some color study
// https://albersfoundation.org/art/anni-albers/weavings/#slide13

window.setup = function () {
  pixelDensity(1);

  createCanvas(1024, 1024);
  frameRate(60);
  colorMode(HSB, 1);

  noLoop();

  // append api key input field
  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("id", "API-KEY");
  input.setAttribute("placeholder", "API-KEY");
  document.body.appendChild(input);

  // create a submit button

  const submit = document.createElement("button");
  submit.textContent = "Submit";
  submit.addEventListener("click", paintIt);
  document.body.appendChild(submit);
};

window.draw = function () {
  background("white");
  noFill();
  stroke("black");
  strokeWeight(3);
  noStroke();
  // draw grid of randomly colored squares
  const rows = 10;
  const cols = 10;
  const margin = 100;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = margin + (col * (width - 2 * margin)) / cols;
      const y = margin + (row * (height - 2 * margin)) / rows;
      const w = (width - 2 * margin) / cols;
      const h = (height - 2 * margin) / rows;
      const hue = random();
      const sat = random(0.2, 0.8);
      const bri = random(0.2, 0.8);
      fill(hue, sat, bri);
      rect(x, y, w, h);
    }
  }
};

async function paintIt() {
  console.log("start painting");

  const formData = new FormData();
  // get canvas as png to send to api
  const canvas = document.getElementsByTagName("canvas")[0];
  const dataURL = canvas.toDataURL("image/png");
  const blob = await (await fetch(dataURL)).blob();
  formData.append("init_image", blob);

  //   formData.append("init_image", fs.readFileSync("../init_image.png"));
  formData.append("init_image_mode", "IMAGE_STRENGTH");
  formData.append("image_strength", 0.35);
  formData.append("steps", 30);
  //   formData.append("width", 1024);
  //   formData.append("height", 1024);
  formData.append("seed", 0);
  formData.append("cfg_scale", 35);
  formData.append("samples", 1);
  formData.append(
    "text_prompts[0][text]",
    // "acrylic painting on canvas, rough natural texture, abstract art, brush strokes, drips",
    // "hand made collage with various special papers",
    "child's drawing with crayon",
  );
  formData.append("text_prompts[0][weight]", 1);
  formData.append("text_prompts[1][text]", "computer art, vector");
  formData.append("text_prompts[1][weight]", -1);

  // get query string from input field #API-KEY
  const API_KEY = document.getElementById("API-KEY").value;
  console.log(`API_KEY: ${API_KEY}`);
  console.log(formData);
  console.log("sending request");
  const response = await fetch(
    "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image",
    {
      method: "POST",
      headers: {
        // ...formData.getHeaders(),
        ...formData,
        Accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: formData,
    },
  );
  console.log("got response");
  console.log(response);

  if (!response.ok) {
    throw new Error(`Non-200 response: ${await response.text()}`);
  }

  const responseJSON = await response.json();
  console.log(responseJSON);

  responseJSON.artifacts.forEach((image, index) => {
    // const imageBuffer = Buffer.from(image.base64, "base64");
    // create and append img
    // const imgBase64 = image.base64;

    const img = document.createElement("img");
    img.src = `data:image/png;base64,${image.base64}`;
    // append image to body
    document.body.appendChild(img);
  });
}

function randomInt(a, b) {
  return floor(random(a, b));
}
function middleRandom(min, max) {
  return (random(min, max) + random(min, max) + random(min, max)) * 0.333;
}
