# OpenAI + Javascript

Examples for the OpenAI + Javascript class.




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
stop them. `ctrl-c` isn't always working, sometimes just entering empty input will close the program.


### Tips

- Have the Chrome Dev Tools open.
- Make sure `Dev Tools > Network > Disable cache` is checked.
- Keep an eye on the dev tools console. Thats where chrome tells you about problems.

# Formatting

# Linting

# Testing
