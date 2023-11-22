import express from "express";
import path from "path";
import url from "url";

import { makeImage } from "../../shared/openai.js";

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

console.log("Hello, Web + DALL•E!");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/makeImage", async (req, res) => {
  try {
    const response = await makeImage(req.body.prompt);
    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting GPT response.");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
