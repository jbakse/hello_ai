import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { createExitSignal, staticServer } from "../shared/server.ts";
import { spriteChat } from "./spriteChat.js";

// Change the current working directory to the directory of this script
// This is necessary to serve static files with the correct path even
// when the script is executed from a different directory
Deno.chdir(new URL(".", import.meta.url).pathname);
// log the current working directory with friendly message
console.log(`Current working directory: ${Deno.cwd()}`);

// Setup server
const app = new Application();
const router = new Router();
router.post("/spriteChat", spriteChat);

app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticServer);

// Start server
console.log(`Listening on http://localhost:8000`);
await app.listen({ port: 8000, signal: createExitSignal() });
