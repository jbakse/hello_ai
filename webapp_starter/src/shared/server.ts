import * as log from "./logger.ts";

import { Context } from "https://deno.land/x/oak@14.2.0/context.ts";
import { type Next } from "https://deno.land/x/oak@14.2.0/middleware.ts";

// Serve static files from public directory
export async function staticServer(context: Context, next: Next) {
  try {
    console.log(`staticServer request: ${context.request.url.pathname}`);
    // check if cwd contains public folder
    if (!Deno.statSync(`${Deno.cwd()}/public`).isDirectory) {
      log.error("Public folder not found");
      log.log("cwd: ", Deno.cwd());
      console.log(`cwd: ${Deno.cwd()}`);
      console.log("cwd contains:");
      for await (const dirEntry of Deno.readDir(".")) {
        console.log(dirEntry.name);
      }
    }

    await context.send({
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  } catch {
    await next();
  }
}

export function createExitSignal() {
  const exitController = new AbortController();
  Deno.addSignalListener(
    "SIGINT",
    function onSigInt() {
      log.warn("Received SIGINT, sending abort signal.");
      exitController.abort();
      log.warn("Exiting");
      Deno.exit();
      return false;
    },
  );

  return exitController.signal;
}
