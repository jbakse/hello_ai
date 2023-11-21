import express from "express";
import path from "path";
import url from "url";

console.log("hello, web");

const app = express();
const port = 3000;

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(__dirname + "/public"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
