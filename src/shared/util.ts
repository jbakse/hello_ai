import * as fs from "https://deno.land/std@0.214.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.214.0/path/mod.ts";
import * as dotenv from "https://deno.land/std@0.214.0/dotenv/mod.ts";
import * as log from "./logger.ts";

/**
 * Checks if the code is running in a Deno deployment environment.
 * @returns {boolean}
 */
export function isDenoDeployment() {
  const isDeployed = Deno.env.get("DENO_DEPLOYMENT_ID") ?? false;
  log.info(
    `running in ${isDeployed ? "deployed" : "local"} environment`,
  );
  return isDeployed;
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
  log.debug(env);
  return env;
}

/**
 * Retrieves the directory name of the current module. This function is a Deno
 * replacement for Node.js's __dirname.
 *
 * @returns {string} The absolute directory path of the current module.
 */
export function getModuleDirectory(): string {
  return path.dirname(path.fromFileUrl(import.meta.url));
}

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
