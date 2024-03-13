// Oak is a middleware framework for Deno's http server, it makes it easier to
// write web apps in Deno.
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// static server serves files from the public directory
// exitSignal is used to shut down the server when the process exits (ctrl-c)
import { createExitSignal, staticServer } from "../shared/server.ts";

const kv = await Deno.openKv();

// create web server and set it up to serve static files from public
const app = new Application();
const router = new Router();

router.get("/api/random", (ctx) => {
  ctx.response.body = Math.random();
});

router.get("/api/randomint", (ctx) => {
  ctx.response.body = Math.floor(Math.random() * 100);
});

router.get("/api/hits", async (ctx) => {
  const kvResponse = await kv.get(["hits"]);
  const hits = kvResponse.value ?? 0;
  kv.set(["hits"], hits + 1);
  console.log(hits);
  ctx.response.body = hits;
});

app.use(router.routes());
app.use(staticServer);

// tell the user we are about to start
console.log("\nListening on http://localhost:8000");
console.log(`Current Working Directory: ${Deno.cwd()}`);
// start the web server
await app.listen({ port: 8000, signal: createExitSignal() });
