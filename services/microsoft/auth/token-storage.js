/**
 * Microsoft Token Storage
 * Extends BaseTokenStorage with Microsoft-specific OAuth handling
 */

const BaseTokenStorage = require('../../../common/base-token-storage');
const path = require('path');

class MicrosoftTokenStorage extends BaseTokenStorage {
  constructor(config) {
    // Get tenant ID from env or config
    const tenantId = config?.tenantId || process.env.MS_TENANT_ID || 'common';

    // Merge with defaults and pass to parent
    const defaultConfig = {
      tokenStorePath: path.join(process.env.HOME || process.env.USERPROFILE, '.microsoft-token.json'),
      clientId: process.env.MS_CLIENT_ID || process.env.OUTLOOK_CLIENT_ID,
      clientSecret: process.env.MS_CLIENT_SECRET || process.env.OUTLOOK_CLIENT_SECRET,
      tenantId: tenantId,
      redirectUri: 'http://localhost:3333/auth/microsoft/callback',
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
      tokenEndpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      refreshTokenBuffer: 5 * 60 * 1000, // 5 minutes
      ...config
    };

    super(defaultConfig);
  }

  // Microsoft OAuth uses standard OAuth 2.0, so no need to override
  // buildRefreshTokenRequest or buildAuthCodeRequest unless needed
}

module.exports = MicrosoftTokenStorage;
