import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { promptGPT } from "../../shared/openai.ts";
import { createExitSignal, staticServer } from "../../shared/server.ts";
import { Chalk } from "npm:chalk@5";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.9.0";
import { loadEnv } from "../../shared/util.ts";
import { encodeBase64 } from "https://deno.land/std/encoding/base64.ts";

//
//
// config program
const env = loadEnv();
const chalk = new Chalk({ level: 1 });
Deno.chdir(new URL(".", import.meta.url).pathname);
console.log(`Current working directory: ${Deno.cwd()}`);
const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY);

async function readFile64(path) {
  const data = await Deno.readFile(path);
  return encodeBase64(data);
}

// // set up server
const app = new Application();
const router = new Router();

// API routes
router.post("/api/vision", async (ctx) => {
  console.log("/api/vision");
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const body = await ctx.request.body().value;

  const prompt = "Describe the content of the image.";

  const imagePart = {
    inlineData: {
      // data: await readFile64("./pot.jpg"),
      data: body.data,
      mimeType: body.type,
    },
  };

  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  const text = response.text();

  ctx.response.body = text;
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticServer);

console.log(chalk.green("\nListening on http://localhost:8000"));

await app.listen({ port: 8000, signal: createExitSignal() });
