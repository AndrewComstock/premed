#!/usr/bin/env bash
# Deploys the agent API stack (agents + customer portal) and loads the portal demo data.
#
#   PORTAL_DEMO_PASSWORD='<choose one>' \
#   ALLOWED_ORIGIN='https://main.<app-id>.amplifyapp.com,http://localhost:3000' \
#   infra/agent-api/scripts/deploy.sh
#
# Needs the AWS SAM CLI, Node 22 and credentials for the target account.
# Set SKIP_SEED=1 to deploy without touching the portal data or passwords.
set -euo pipefail
cd "$(dirname "$0")/.."
: "${AWS_REGION:=${AWS_DEFAULT_REGION:-us-east-1}}"
export AWS_REGION AWS_DEFAULT_REGION="$AWS_REGION"
: "${ALLOWED_ORIGIN:=*}"

sam build
sam deploy --no-confirm-changeset --no-fail-on-empty-changeset --region "$AWS_REGION" \
  --parameter-overrides "AllowedOrigin=$ALLOWED_ORIGIN"

if [ -z "${SKIP_SEED:-}" ]; then
  npm install --no-audit --no-fund
  npm run -s seed:portal
fi

aws cloudformation describe-stacks --stack-name halcyra-agent-api --region "$AWS_REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='AgentApiUrl'].OutputValue" --output text
