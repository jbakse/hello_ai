// Oak is a middleware framework for Deno's http server, it makes it easier to
// write web apps in Deno.
import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// static server serves files from the public directory
// exitSignal is used to shut down the server when the process exits (ctrl-c)
import { createExitSignal, staticServer } from "../shared/server.ts";

// create web server and set it up to serve static files from public
const app = new Application();
app.use(staticServer);

// tell the user we are about to start
console.log("\nListening on http://localhost:8000");

// start the web server
await app.listen({ port: 8000, signal: createExitSignal() });
