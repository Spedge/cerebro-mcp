# Scripts Directory

This directory contains utility scripts for testing, debugging, and development purposes.

## Directory Structure

```
scripts/
├── test/        # Testing scripts
└── debug/       # Debugging and diagnostic scripts
```

## Test Scripts

### test-modular-server.sh
Interactive testing using MCP Inspector. This script launches the MCP Inspector which provides a GUI for testing all the available MCP tools.

**Usage:**
```bash
./scripts/test/test-modular-server.sh
```

### test-direct.sh
Direct protocol-level testing. This script starts the server and sends JSON-RPC requests directly to test the MCP protocol implementation.

**Usage:**
```bash
./scripts/test/test-direct.sh
```

### test-pagination.js
Manual testing for pagination functionality. Tests the Graph API pagination implementation with various page sizes and result limits.

**Usage:**
```bash
node scripts/test/test-pagination.js
```

**Requirements:** Must be authenticated first (run `npm run auth-server` and authenticate).

## Debug Scripts

### debug-env.js
Diagnostic script that outputs all environment variables and command-line arguments. Useful for troubleshooting configuration issues.

**Usage:**
```bash
node scripts/debug/debug-env.js
```

### test-config.js
Tests and displays the loaded configuration including paths, environment variables, and computed values.

**Usage:**
```bash
node scripts/debug/test-config.js
```

## Notes

- All test scripts automatically resolve paths relative to the project root
- Scripts require dependencies to be installed (`npm install`)
- Authentication scripts require the auth server to be running (`npm run auth-server`)
