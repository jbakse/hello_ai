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
 * Retrieves the value of an environment variable by name.
 * First checks Deno.env, then falls back to a .env file.
 * @param variableName The name of the environment variable to retrieve.
 * @returns The value of the environment variable, or undefined if not found.
 */
export function getEnvVariable(variableName: string): string | undefined {
  // look in environment variables first
  let value = Deno.env.get(variableName);
  if (value) {
    log.info(`${variableName} found in Deno.env: ${elide(value)}`);
    return value;
  }

  // then look in .env file
  const env = loadEnv();
  value = env[variableName];
  if (value) {
    log.info(`${variableName} found in .env file: ${elide(value)}`);
    return value;
  }

  // if not found, report
  log.warn(`${variableName} not found in Deno.env or .env file.
      cwd: ${Deno.cwd()}
      script: ${import.meta.url}`);

  return undefined;
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
    elidedEnv[key] = elide(elidedEnv[key]);
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
export function getModuleDirectory(): string {
  return path.dirname(path.fromFileUrl(import.meta.url));
}

/**
 * Searches up the directory tree for a specified file.
 * @param filename The name of the file to search for.
 * @param currentPath The directory to start the search from.
 * @returns The absolute path to the file, or false if not found.
 */

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

export function elide(s: string, start = 3, end = 3) {
  return s.slice(0, start) + "..." + s.slice(-end);
}
