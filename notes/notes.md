# Libraries of interest

## CLI utilities

[https://github.com/unjs/consola](Consola) - Console logger
[https://github.com/enquirer/enquirer](Enquirer) - CLI prompts
[https://github.com/sindresorhus/ora](Ora) - Elegant terminal spinner

# Deployments

Deno has a severless hosting service called [https://deno.com/deploy](Deno Deploy).

You can deploy projects using this service either by configuring it to watch a git repo, or by using the `deployctl` command line tool.

The woodsprite example is set up to deploy using deployctl.

1. make sure you have an [access token set up](https://dash.deno.com/account#access-tokens)
2. make sure your acess token is set on your environment `export DENO_DEPLOY_TOKEN=xxx`
3. cd to the `src/`
4. run the deploy task `deno task deploy-woodsprite`

Note that the deploy script is in `src/deno.json` rather than `src/woodsprite/deno.json` so that the `shared` directory is included in the deployment.

# Killing App by Port

```bash
kill -9 $(lsof -t -i:8000)
```
