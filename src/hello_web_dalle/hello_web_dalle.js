// Oak is a middleware framework for Deno's http server, it makes it easier to
// write web apps in Deno.
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

import { makeImage } from "../shared/openai.ts";

// static server serves files from the public directory
// exitSignal is used to shut down the server when the process exits (ctrl-c)
import { createExitSignal, staticServer } from "../shared/server.ts";

// create web server
const app = new Application();
const router = new Router();

// add the DALL•E route
router.get("/api/dalle", async (ctx) => {
  const prompt = ctx.request.url.searchParams.get("prompt");
  console.log("Request received");
  console.log(prompt);
  const shortPrompt = prompt.slice(0, 128);
  const result = await makeImage(shortPrompt);
  ctx.response.body = result;
});

// set it up to serve static files from public
app.use(staticServer);

// install routes
app.use(router.routes());
app.use(router.allowedMethods());

// tell the user we are about to start
console.log("\nListening on http://localhost:8000");

// start the web server
await app.listen({ port: 8000, signal: createExitSignal() });
