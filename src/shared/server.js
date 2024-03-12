import process from "node:process";
import * as log from "./logger.ts";

// Serve static files from public directory
export async function staticServer(context, next) {
  try {
    await context.send({
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  } catch {
    await next();
  }
}

const exitController = new AbortController();
Deno.addSignalListener("SIGINT", () => {
  Deno.exit();
});
process.on("exit", () => {
  log.info("Goodbye!");
  exitController.abort();
});
export const exitSignal = exitController.signal;
