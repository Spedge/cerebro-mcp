# Cerebro MCP Server

A **multi-service MCP (Model Context Protocol) server** that connects Claude with multiple productivity services and APIs through a unified, extensible architecture.

## Currently Supported Services

- **Microsoft 365 / Outlook** - Email, calendar, contacts, and more through Microsoft Graph API
- **Slack** - *Coming soon*

## Architecture

Cerebro uses a modular, service-based architecture that makes it easy to add new integrations:

### Directory Structure

```
cerebro-mcp/
├── index.js                    # Main entry point (multi-service orchestrator)
├── config.js                   # Shared configuration
├── common/                     # Shared infrastructure
│   ├── auth-server.js         # Unified OAuth server (port 3333)
│   ├── base-token-storage.js  # Base class for token management
│   └── base-api-client.js     # Base class for API clients
├── services/                   # Service integrations
│   ├── microsoft/             # Microsoft 365 service
│   │   ├── index.js           # Service entry point
│   │   ├── config.js          # Microsoft-specific config
│   │   ├── auth/              # OAuth authentication
│   │   ├── calendar/          # Calendar operations
│   │   ├── email/             # Email management
│   │   ├── folder/            # Folder operations
│   │   ├── rules/             # Email rules
│   │   ├── utils/             # MS Graph API client
│   │   └── test/              # Service tests
│   └── slack/                 # Future: Slack service
└── package.json

```

## Tool Naming Convention

All tools use **service namespaces** for clarity:

- Microsoft tools: `microsoft.authenticate`, `microsoft.list_emails`, `microsoft.send_email`, etc.
- Future Slack tools: `slack.send_message`, `slack.list_channels`, etc.

This makes it immediately clear which service each tool belongs to.

## Features

- **Multi-Service Architecture**: Clean separation between services, easy to extend
- **Unified Authentication**: Single OAuth server handles all services
- **Service Namespacing**: Tools are namespaced by service (e.g., `microsoft.list_emails`)
- **Modular Design**: Each service is self-contained and independently testable
- **Base Classes**: Common patterns abstracted for reuse across services
- **Test Mode**: Service-specific mock data for testing
- **OAuth 2.0**: Secure authentication with automatic token refresh

### Microsoft 365 Features

- **Email Management**: List, search, read, and send emails
- **Calendar Management**: List, create, accept, decline, delete events
- **Folder Operations**: List, create, move emails between folders
- **Rules Management**: List and create email rules
- **OData Filtering**: Proper escaping and formatting of complex queries

## Quick Start

1. **Install dependencies**: `npm install`
2. **Azure setup**: Register app in Azure Portal (see detailed steps below)
3. **Configure environment**: Copy `.env.example` to `.env` and add your Azure credentials
4. **Configure Claude**: Update your Claude Desktop config with the server path
5. **Start auth server**: `npm run auth-server`
6. **Authenticate**: Use `microsoft.authenticate` tool in Claude to get the OAuth URL
7. **Start using**: Access your Microsoft services through Claude!

## Installation

### Prerequisites

- Node.js 14.0.0 or higher
- npm or yarn package manager
- Azure account for Microsoft 365 integration

### Install Dependencies

```bash
npm install
```

This installs:
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `dotenv` - Environment variable management

## Azure App Registration & Configuration

To use Microsoft 365 integration, register an app in Azure Portal:

### App Registration

1. Open [Azure Portal](https://portal.azure.com/)
2. Sign in with a Microsoft account
3. Search for "App registrations"
4. Click "New registration"
5. Enter name: "Cerebro MCP Server"
6. Select "Accounts in any organizational directory and personal Microsoft accounts"
7. **Redirect URI**: Select "Web" and enter **one** of the following:
   - **NEW (Recommended)**: `http://localhost:3333/auth/microsoft/callback`
   - **Legacy (Deprecated)**: `http://localhost:3333/auth/callback` - *For backward compatibility only. Will be removed in future versions.*
8. Click "Register"
9. Copy the "Application (client) ID" - you'll need this as `MS_CLIENT_ID`

**Note**: The server supports both callback URLs for backward compatibility, but please migrate to the new URL format.

### App Permissions

1. In app settings, select "API permissions"
2. Click "Add a permission" → "Microsoft Graph" → "Delegated permissions"
3. Add these permissions:
   - `offline_access`
   - `User.Read`
   - `Mail.Read`
   - `Mail.ReadWrite`
   - `Mail.Send`
   - `Calendars.Read`
   - `Calendars.ReadWrite`
   - `Contacts.Read`
4. Click "Add permissions"

### Client Secret

1. Select "Certificates & secrets" → "Client secrets" tab
2. Click "New client secret"
3. Enter description and select longest expiration
4. Click "Add"
5. **⚠️ IMPORTANT**: Copy the secret **VALUE** (not Secret ID) immediately - you can't view it again!

## Configuration

### 1. Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your Azure credentials:

```bash
# Microsoft 365 Configuration
MS_CLIENT_ID=your-application-client-id-here
MS_CLIENT_SECRET=your-client-secret-VALUE-here
MS_TENANT_ID=common

# Global Settings
USE_TEST_MODE=false
```

**Important**: Use the secret **VALUE**, never the Secret ID!

### 2. Claude Desktop Configuration

Update your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "cerebro": {
      "command": "node",
      "args": [
        "/absolute/path/to/cerebro-mcp/index.js"
      ],
      "env": {
        "MS_CLIENT_ID": "your-client-id-here",
        "MS_CLIENT_SECRET": "your-client-secret-here",
        "MS_TENANT_ID": "common",
        "USE_TEST_MODE": "false"
      }
    }
  }
}
```

## Usage with Claude Desktop

### Initial Setup

1. **Configure Claude Desktop**: Add server configuration (see above)
2. **Restart Claude Desktop**: Close and reopen to load the MCP server
3. **Start Authentication Server**:
   ```bash
   npm run auth-server
   ```
4. **Authenticate in Claude**: Use `microsoft.authenticate` tool
5. **Visit OAuth URL**: Complete the authentication flow in your browser
6. **Start Using**: Try `microsoft.list-emails` or other tools!

### Available Microsoft Tools

Once authenticated, you can use:

- `microsoft.about` - Server information
- `microsoft.authenticate` - Authenticate with Microsoft
- `microsoft.check-auth-status` - Check auth status
- `microsoft.list-emails` - List recent emails
- `microsoft.search-emails` - Search emails
- `microsoft.read-email` - Read email details
- `microsoft.send-email` - Send new email
- `microsoft.mark-as-read` - Mark email as read/unread
- `microsoft.list-events` - List calendar events
- `microsoft.create-event` - Create calendar event
- `microsoft.decline-event` - Decline event invitation
- `microsoft.cancel-event` - Cancel an event
- `microsoft.delete-event` - Delete event
- `microsoft.list-folders` - List mail folders
- `microsoft.create-folder` - Create new folder
- `microsoft.move-emails` - Move emails to folder
- `microsoft.list-rules` - List email rules
- `microsoft.create-rule` - Create email rule
- `microsoft.edit-rule-sequence` - Edit rule sequence order

## Authentication Flow

### Microsoft 365

1. Start unified auth server: `npm run auth-server`
2. Use `microsoft.authenticate` tool in Claude
3. Visit URL: `http://localhost:3333/auth/microsoft/login`
4. Sign in with Microsoft and grant permissions
5. Redirected to: `http://localhost:3333/auth/microsoft/callback`
6. Tokens stored in `~/.microsoft-token.json`
7. Automatic token refresh when needed

The unified auth server handles authentication for all services on port 3333.

## Troubleshooting

### Common Issues

#### "Cannot find module '@modelcontextprotocol/sdk'"
**Solution**: Install dependencies
```bash
npm install
```

#### "Port 3333 already in use"
**Solution**: Kill existing process
```bash
npx kill-port 3333
npm run auth-server
```

#### "Invalid client secret" (AADSTS7000215)
**Cause**: Using Secret ID instead of Secret VALUE

**Solution**:
1. Go to Azure Portal → App → Certificates & secrets
2. Copy the **Value** column (not Secret ID)
3. Update `.env`: `MS_CLIENT_SECRET=actual-value`
4. Update Claude config: `MS_CLIENT_SECRET=actual-value`

#### Authentication URL doesn't work
**Cause**: Auth server not running

**Solution**:
1. Start auth server: `npm run auth-server`
2. Wait for "Authentication server running"
3. Then try authentication

#### "Tool not found: list_emails" or "Tool not found: list-emails"
**Cause**: Wrong tool name (missing service prefix or using underscores instead of hyphens)

**Solution**: Use `microsoft.list-emails` (with service namespace and hyphens)

#### Token expired / Authentication required
**Solution**:
1. Delete token file: `rm ~/.microsoft-token.json`
2. Restart auth server: `npm run auth-server`
3. Re-authenticate: `microsoft.authenticate`

## Development

### Adding a New Service

Want to add Slack, Google, or another service? We've made it easy!

**Quick Start**: See [ADDING_SERVICES.md](ADDING_SERVICES.md) for a streamlined checklist

**Complete Guide**: See [CLAUDE.md](CLAUDE.md#adding-new-services---complete-guide) for step-by-step instructions with code examples

The architecture is designed to make adding services straightforward:
1. Create service directory (5 min)
2. Implement configuration (5 min)
3. Extend base classes (20 min)
4. Add feature modules (30+ min)
5. Register service (5 min)

**That's it!** Tools get automatic namespacing, OAuth is handled by the unified auth server, and no changes to common infrastructure are needed.

**Reference Implementation**: `services/microsoft/` - Complete example to copy from

### Running Tests

```bash
npm test                    # All tests
npm run test:microsoft      # Microsoft service only
```

### Test Mode

Enable test mode for development without real API calls:

```bash
USE_TEST_MODE=true npm start
```

## License

MIT

## Contributing

Contributions welcome! Please ensure:
- Follow the service-based architecture pattern
- Add tests for new features
- Update documentation
- Use service namespaces for new tools
