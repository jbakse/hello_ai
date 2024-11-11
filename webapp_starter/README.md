# WEBAPP_STARTER

This is a template for a simple Deno webapp project using Oak.

This is the starter project for Web App assignment in the Javascript + OpenAI
course.

## File Structure

**.vscode** configuration files for VS Code

**src** JavaScript source files

**src/shared** JS+OAI shared library code

**.env-template** template for .env file, which will hold your API keys

**.gitignore** tells git which files to ignore

**README.md** this file, info about the repo

## Running

You should run this app fromt the root of the project (`webapp_starter/`)

```bash
cd path/to/webapp_starter
```

If you aren't in the correct path your app won't work, so double check! Confirm
that your current working directory is the root of the project.

```bash
pwd
```

Option 1: run the app directly

```bash
deno run -A src/main.js
```

Option 2: use the tesk defined in deno.json

```bash
deno task start
```

When you are done, shut it down by typing `ctrl-c` in the terminal.

## Troubleshooting

**error: AddrInUse: Address already in use** This error can happen if your app
exits without properly closing the server . You can fix this by killing the
process that is using the port.

```
kill -9 $(lsof -t -i:8000)
```

## Deploying to Deno Deploy

[Deno Deploy](https://deno.com/deploy) is a hosting service from Deno.

1. Log in to https://deno.com/deploy
2. New Project
3. Select your organiztion, repo, branch
4. Thoughtfully name the project
5. Set the install and build steps (if needed*)
6. Set root directory (if needed*)
7. Set the include and exclude files (if needed*)
8. Set entrypoint

Its not going to work yet! You need to set the API key!

1. Go to project settings.
2. Add an evironment variable: `OPENAI_API_KEY=yourkey`

*for a simple project/repo, you won't need to set these

```bash
/Users/jbakse/.deno/bin/deployctl -v
```
