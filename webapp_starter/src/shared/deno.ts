/**
 * Checks if the code is running in a Deno deployment environment.
 * @returns {boolean}
 */
export function isDenoDeployment() {
  return Deno.env.get("DENO_DEPLOYMENT_ID") ?? false;
}
