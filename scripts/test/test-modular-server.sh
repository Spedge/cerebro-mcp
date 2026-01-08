#!/bin/bash
# Test the modular Outlook MCP server using MCP Inspector

echo "Testing modular Outlook MCP server..."

# Get the script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Use the MCP Inspector to test the server
npx @modelcontextprotocol/inspector node "$PROJECT_ROOT/index.js"
