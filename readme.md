# Hello, AI!

This repository contains code examples written for use in my classes.

The examples are written in Javascript for the Deno runtime.

### Running the Hello_X! examples

Each hello_x example is in its own folder. Each folder has a `deno.json` file that contains
the task to run the demo. To run the demo, `cd` into the demo folder and run
`deno task start`.

```bash
cd src/deno/hello_deno
deno task start
```

### Running the other examples

Some examples such as `prompt_examples/triva.js` are a single file. You can run
these directly with deno, and pass the `-A` flag to allow _all_ permissions.

```bash
deno run -A src/prompt_examples/trivia.js
```

### Quitting the examples

Some of the examples run until you stop them explicitly. You can use `ctrl-c` to
stop them. After I ported these to Deno `ctrl-c` isn't always working, sometimes just entering empty input will close the program.

### Tips

If you are running a web demo:

- Have the Chrome Dev Tools open.
- Make sure `Dev Tools > Network > Disable cache` is checked.
- Keep an eye on the dev tools console. Thats where chrome tells you about problems.

# Formatting + Linting

Deno has its own formatter and linter! If you have the VSCode Deno extension installed and configured it will use Deno to format and lint your code. I suggest configuring VS Code to format on save. My Deno config is in `.vscode/settings.json`.

# Testing

This code doesn't have any tests yet. There -is- a stub of a test file `src/deno_test.ts` that I set up to make sure that the Deno test runner is set up, but it doesn't have any useful tests in it yet.
