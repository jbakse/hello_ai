import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { gptPrompt } from "./gpt.js";

// change working directory to directory of this file
const dirName = new URL(".", Deno.mainModule).pathname;
Deno.chdir(dirName);

const app = new Application();
const router = new Router();

// Serve static files from public directory
async function staticServer(context, next) {
  try {
    await context.send({
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  } catch {
    await next();
  }
}
app.use(staticServer);

// API routes
router.get("/api/gpt", async (ctx) => {
  const result = await gptPrompt("What rhymes with orange? Be breif!");
  ctx.response.body = result;
});
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Listening on http://localhost:8000`);
await app.listen({ port: 8000 });
