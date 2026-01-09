/**
 * Microsoft 365 / Outlook Service Configuration
 */
const path = require('path');
const os = require('os');

// Ensure we have a home directory path
const homeDir = process.env.HOME || process.env.USERPROFILE || os.homedir() || '/tmp';

module.exports = {
  // Service metadata
  SERVICE_NAME: 'microsoft',
  SERVICE_DISPLAY_NAME: 'Microsoft 365',
  SERVICE_VERSION: '1.0.0',

  // Test mode setting
  USE_TEST_MODE: process.env.USE_TEST_MODE === 'true',

  // Authentication configuration
  AUTH_CONFIG: {
    clientId: process.env.OUTLOOK_CLIENT_ID || process.env.MS_CLIENT_ID || '',
    clientSecret: process.env.OUTLOOK_CLIENT_SECRET || process.env.MS_CLIENT_SECRET || '',
    tenantId: process.env.MS_TENANT_ID || 'common',
    redirectUri: 'https://localhost:3333/auth/microsoft/callback',
    // Legacy redirect URI for backward compatibility
    // TODO: Remove after migration period
    legacyRedirectUri: 'http://localhost:3333/auth/callback',
    scopes: [
      'offline_access',
      'User.Read',
      'Mail.Read',
      'Mail.ReadWrite',
      'Mail.Send',
      'Calendars.Read',
      'Calendars.ReadWrite',
      'Contacts.Read'
    ],
    tokenStorePath: path.join(homeDir, '.microsoft-token.json'),
    get tokenEndpoint() {
      return `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
    },
    authServerUrl: 'https://localhost:3333'
  },

  // Microsoft Graph API
  GRAPH_API_ENDPOINT: 'https://graph.microsoft.com/v1.0/',

  // Field selectors for Graph API queries
  EMAIL_SELECT_FIELDS: 'id,subject,from,toRecipients,ccRecipients,receivedDateTime,bodyPreview,hasAttachments,importance,isRead',
  EMAIL_DETAIL_FIELDS: 'id,subject,from,toRecipients,ccRecipients,bccRecipients,receivedDateTime,bodyPreview,body,hasAttachments,importance,isRead,internetMessageHeaders',
  CALENDAR_SELECT_FIELDS: 'id,subject,bodyPreview,start,end,location,organizer,attendees,isAllDay,isCancelled',

  // Pagination settings
  DEFAULT_PAGE_SIZE: 25,
  MAX_RESULT_COUNT: 50,

  // Timezone
  DEFAULT_TIMEZONE: 'Central European Standard Time',
};
