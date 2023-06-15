#!/bin/bash
set -uo pipefail

# Install dependencies if node_modules does not exist (skip otherwise to save time)
[ ! -d "node_modules" ] && npm install --loglevel info

exec "$@"
