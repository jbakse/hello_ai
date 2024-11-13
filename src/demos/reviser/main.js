import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";
import { promptGPT } from "./shared/openai.ts";
import { createExitSignal, staticServer } from "./shared/server.ts";
import { logFolder } from "./shared/util.ts";
import * as log from "./shared/logger.ts";

/// configure logging
// tell the shared library code to log as much as possible
log.setLogLevel(log.LogLevel.ALL);

/// print greeting
console.clear();
log.info(colors.bgWhite.black(" Reviser "));

/// set working directory
// set working directory to this script's directory so ./public can be found regardless of where the script is run from
Deno.chdir(import.meta.dirname);
log.info("Current working directory:", Deno.cwd());
// log the current working directory and contents
// this helps with debugging deployments

logFolder(".");
logFolder("public");
logFolder("shared");

/// create the app
const app = new Application();
const router = new Router();

/// define api routes
router.get("/api/gpt", async (ctx) => {
  const prompt = ctx.request.url.searchParams.get("prompt");
  const shortPrompt = prompt.slice(0, 1024);
  const result = await promptGPT(shortPrompt, { max_tokens: 1024 });
  ctx.response.body = result;
});

/// configure the app
app.use(router.routes());
app.use(staticServer);

/// start the server
log.info(colors.green("Listening on http://localhost:8000"));
await app.listen({ port: 8000, signal: createExitSignal() });
