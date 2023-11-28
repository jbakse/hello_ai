```bash
# ↓ builds the project
sam build

# ↓ test the function
sam local invoke AddFunction -e events/events.json

# ↓ runs the project locally
sam local start-api

# ↓ deploy the project
sam deploy --guided

# ↓ redeploy the project
sam deploy

# ↓ describe the project
aws cloudformation describe-stacks --stack-name hello-sam

# ↓ delete the project
sam delete


```
