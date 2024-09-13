import * as fs from "https://deno.land/std@0.214.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.214.0/path/mod.ts";
import * as dotenv from "https://deno.land/std@0.214.0/dotenv/mod.ts";
import * as log from "./logger.ts";

/**
 * Checks if the code is running in a Deno deployment environment.
 * @returns {boolean}
 */
export function isDenoDeployment() {
  return Deno.env.get("DENO_DEPLOYMENT_ID") ?? false;
}

/**
 * Loads environment variables from a specified .env file.
 * Searches up the directory tree starting from the given path.
 * @param name name of the .env file (default: ".env").
 * @param path starting directory to search (default: Deno.cwd()).
 * @returns An object containing the loaded environment variables.
 */

export function loadEnv(name = ".env", path = Deno.cwd()) {
  const envPath = findFileUpTree(name, path);
  if (!envPath) {
    log.warn(".env file not found");
    log.warn(`current working directory is '${Deno.cwd()}'`);
    return {};
  }
  log.info(`loading environment variables from '${envPath}'`);
  const env = dotenv.loadSync({ envPath });

  // debug log the environment variables, eliding sensitive information
  const elidedEnv = { ...env };
  for (const key in elidedEnv) {
    elidedEnv[key] = elide(elidedEnv[key], 3, 5);
  }
  log.debug(elidedEnv);

  return env;
}

/**
 * Retrieves the directory name of the current module. This function is a Deno
 * replacement for Node.js's __dirname.
 *
 * @returns {string | false} The absolute directory path of the current module.
 */
// export function getModuleDirectory(): string {
//   return path.dirname(path.fromFileUrl(import.meta.url));
// }

function findFileUpTree(
  filename: string,
  currentPath: string,
): string | false {
  while (true) {
    // Check if the file exists in the current directory
    const potentialFilePath = path.join(currentPath, filename);
    if (fs.existsSync(potentialFilePath)) return potentialFilePath;

    // Move up one level
    const oldPath = currentPath;
    currentPath = path.resolve(currentPath, "..");

    // Check if we've reached the system root
    if (currentPath === oldPath) return false;
  }
}

/**
 * Elides a string by replacing the middle with an ellipsis.
 * @param s - The string to elide.
 * @param start - The number of characters to keep at the start.
 * @param end - The number of characters to keep at the end.
 * @returns The elided string.
 */

export function elide(s: string, start: number, end: number) {
  return s.slice(0, start) + "..." + s.slice(-end);
}
