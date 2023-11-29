import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

import { gptPrompt } from "./gpt.js";

const app = new Application();

const router = new Router();
// router.get("/", (ctx) => {
//   ctx.response.body = "Hello World!";
// });
router.get("/gpt", async (ctx) => {
  const result = await gptPrompt("What rhymes with orange? Be breif!");
  ctx.response.body = result;
});

app.use(async (context, next) => {
  try {
    console.log("cwd", Deno.cwd());
    await context.send({
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  } catch {
    await next();
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Listening on http://localhost:8000");
await app.listen({ port: 8000 });
