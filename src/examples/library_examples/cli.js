// this file demonstrates how to use the cli utility

// import the commands you want, make sure the path is correct!
import { ask, inspect, say } from "../../shared/cli.ts";

// say outputs a message to the log, it wraps long text
say("Hello, Player!");
say(
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
);

// ask gets input from the user
const name = await ask("What is your name?");
say(`Hello, ${name}!`);

// inspect prints an object
const obj = { name: "Ada", age: 209, city: "London" };
inspect(obj);
