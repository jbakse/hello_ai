// Make a program that asks for the user’s name and then prints “Hello $name”
// This code was generated using gpt-3 + gpt-4 together.
// gpt-3 made code that worked with Node, but not Deno.
// gpt-4 created the a readLine function that works with Deno.
// it would be simpler to use `prompt`. See greetings-prompt.js

const readLine = async (prompt) => {
  const buf = new Uint8Array(1024);

  // Print the prompt to STDOUT
  await Deno.stdout.write(new TextEncoder().encode(prompt));

  // Read the user input from STDIN
  const n = await Deno.stdin.read(buf);
  const answer = new TextDecoder().decode(buf.subarray(0, n));

  // Return the answer, removing any newline characters
  return answer.trim();
};

const main = async () => {
  const name = await readLine("Enter your name: ");
  console.log(`Hello ${name}`);
};

main();
