import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

import { createExitSignal, staticServer } from "../shared/server.ts";
import { gptPrompt } from "../shared/openai.ts";

// change working dirctory to the current file's directory
Deno.chdir(new URL(".", import.meta.url).pathname);
// log the current working directory with friendly message
console.log(`Current working directory: ${Deno.cwd()}`);

const app = new Application();
const router = new Router();

// API routes
router.get("/api/random", (ctx) => {
  ctx.response.body = Math.random();
});

router.get("/api/nonsense", async (ctx) => {
  const result = await gptPrompt(
    `make us a nonsense sentence that looks right but doesn't mean anything.`,
  );
  ctx.response.body = result;
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticServer);

console.log("Listening on http://localhost:8000");

await app.listen({ port: 8000, signal: createExitSignal() });
