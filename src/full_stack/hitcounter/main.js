// Oak is a middleware framework for Deno's http server, it makes it easier to
// write web apps in Deno.
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// static server serves files from the public directory
// exitSignal is used to shut down the server when the process exits (ctrl-c)
import { createExitSignal, staticServer } from "shared/server.ts";

/// set working directory
// set working directory to this script's directory so ./public can be found regardless of where the script is run from
Deno.chdir(import.meta.dirname);

/// load the key-value store
const kv = await Deno.openKv();

/// create oak web server app and router
const app = new Application();
const router = new Router();

/// define api routes
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

/// configure server
app.use(router.routes());
app.use(staticServer);

/// start the server
console.log("\nListening on http://localhost:8000");
await app.listen({ port: 8000, signal: createExitSignal() });
