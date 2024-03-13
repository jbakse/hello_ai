import * as log from "./logger.ts";

import { Context } from "https://deno.land/x/oak@14.2.0/context.ts";
import { type Next } from "https://deno.land/x/oak@14.2.0/middleware.ts";

// Serve static files from public directory
export async function staticServer(context: Context, next: Next) {
  try {
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
