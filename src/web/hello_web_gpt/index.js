import express from "express";
import path from "path";
import url from "url";

import { gptPrompt } from "../../shared/openai.js";

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

console.log("Hello, Web+GPT!");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/gpt", async (req, res) => {
  try {
    const response = await gptPrompt(req.body.prompt);
    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting GPT response.");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
