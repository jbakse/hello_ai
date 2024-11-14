/**
 * Checks if the code is running in a Deno deployment environment.
 * @returns {boolean}
 */
export function isDenoDeployment(): boolean {
  return Deno.env.has("DENO_DEPLOYMENT_ID");
}
