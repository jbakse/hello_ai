import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { gptPrompt } from "../shared/openai.js";
import { staticServer } from "../shared/staticServer.js";

import { Chalk } from "npm:chalk@5";
const chalk = new Chalk({ level: 1 });

// change working directory to directory of this file
const dirName = new URL(".", Deno.mainModule).pathname;
Deno.chdir(dirName);

const controller = new AbortController();
const { signal } = controller;
// Todo: handle more signals, so that the server isn't left open in dev mode
Deno.addSignalListener("SIGINT", () => {
  controller.abort();
  Deno.exit();
});

const app = new Application();
const router = new Router();

// API routes
router.get("/api/gpt", async (ctx) => {
  const result = await gptPrompt("What rhymes with orange? Be breif!");
  ctx.response.body = result;
});

app.use(staticServer);
app.use(router.routes());
app.use(router.allowedMethods());

console.log(chalk.green("\nListening on http://localhost:8000"));

await app.listen({ port: 8000, signal });
