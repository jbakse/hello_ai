import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { gptPrompt } from "../shared/openai.ts";
import { createExitSignal, staticServer } from "../shared/server.ts";
import { Chalk } from "npm:chalk@5";

// output an empty line

// Change the current working directory to the directory of this script
// This is necessary to serve static files with the correct path even
// when the script is executed from a different directory
Deno.chdir(new URL(".", import.meta.url).pathname);
// log the current working directory with friendly message
console.log(`Current working directory: ${Deno.cwd()}`);

const chalk = new Chalk({ level: 1 });

const app = new Application();
const router = new Router();

// API routes
router.get("/api/gpt", async (ctx) => {
  const prompt = ctx.request.url.searchParams.get("prompt");
  const shortPrompt = prompt.slice(0, 1024);
  const result = await gptPrompt(shortPrompt, { max_tokens: 1024 });
  ctx.response.body = result;
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticServer);

console.log(chalk.green("\nListening on http://localhost:8000"));

await app.listen({ port: 8000, signal: createExitSignal() });
