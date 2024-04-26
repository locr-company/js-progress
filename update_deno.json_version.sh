#!/bin/sh

set -e

VERSION=$(node -p "require('./package.json').version")
jq '.version="'${VERSION}'"' deno.json > deno.json.tmp
mv deno.json.tmp deno.json
