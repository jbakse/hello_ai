import * as log from "./logger.ts";

import type { Context } from "https://deno.land/x/oak@14.2.0/context.ts";
import type { Next } from "https://deno.land/x/oak@14.2.0/middleware.ts";

// Serve static files from public directory
export async function staticServer(
  context: Context,
  next: Next,
): Promise<void> {
  try {
    log.log(`request: ${context.request.url.pathname}`);
    await context.send({
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  } catch {
    await next();
  }
}

export function createExitSignal(): AbortSignal {
  const exitController = new AbortController();
  Deno.addSignalListener(
    "SIGINT",
    function onSigInt(): void {
      log.warn("Received SIGINT, sending abort signal.");
      exitController.abort();
      log.warn("Exiting");
      Deno.exit();
    },
  );

  return exitController.signal;
}
