/**
 * This is a basic example showing how to use Deno to make a terminal app.
 */

import { ask, say } from "../shared/cli.js";

say("Hello, Deno!");

const response = ask("What is your name? ");

say(`\nHello, ${response}!`);
