# WEBAPP_STARTER

This is a template for a simple Deno webapp project using Oak.

This is the starter project for Web App assignment in the Javascript + OpenAI
course.

## File Structure

**.vscode** configuration files for VS Code

**public** HTML/CSS/JS/image front end files

**src** JavaScript source files

**src/shared** JS+OAI shared library code

**.env-template** template for .env file, which will hold your API keys

**.gitignore** tells git which files to ignore

**deno.json** task for running the app

**deno.lock** maintained by deno

**devbox.json** ignore this

**devbox.lock** ignore this

**main.js** your main backend file, entry point for depoloyment

**README.md** this file, info about the repo

Also, you should create:

**.env** copy from .env-template, add your API Key

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

Deno Deploy can be connected to a github repository and automatically deploy
changes to your repo when you push.

First, get your project on github.

1. Copy and modify this project.
2. Use git init to turn it into a repo.
3. Commit your files.
4. Push to Github.

Then, set up the deploy on deno deploy.

1. Log in to https://deno.com/deploy
2. New Project
3. Select your organiztion, repo, branch
4. Thoughtfully name the project Your name will be the subdomain of the
   deployment.
5. Set the install and build steps (if needed*)
6. Set root directory (if needed*)
7. Set the include and exclude files (if needed*)
8. Set entrypoint
9. Deploy Project

Its not going to work yet! It might work a little. It might not work at all. It
might even fail to deploy.

You need to set the API key!

1. Log in to https://deno.com/deploy
2. Go to project's settings.
3. Add an evironment variable: `OPENAI_API_KEY=yourkey` Make sure the variables
   name and value are EXACTLY correct! Don't include an extra return or newline.

Note: when working locally your api key is in `.env` but `.env` isn't tracked in
your repo. Thats why you need to set the evironment variable on the deno deploy
dashboard.

*for a simple project/repo, you won't need to set these

```bash
/Users/jbakse/.deno/bin/deployctl -v
```
