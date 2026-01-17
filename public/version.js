/**
 * Application Version - Single Source of Truth
 * Used by both main app and service worker
 */

// Increment this version number when releasing updates
const APP_VERSION = '1.6.6';

// Export for ES6 modules (main app)
export { APP_VERSION };

// Also make available globally for service worker
if (typeof self !== 'undefined') {
  self.APP_VERSION = APP_VERSION;
}
