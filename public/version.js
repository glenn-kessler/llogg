/**
 * Application Version - Single Source of Truth
 * Used by service worker via importScripts()
 *
 * NOTE: This file does NOT use ES6 export syntax because
 * Service Worker's importScripts() doesn't support ES6 modules.
 * Instead, it sets a global variable.
 */

// Increment this version number when releasing updates
const APP_VERSION = '1.7.28';

// Make available globally for service worker
self.APP_VERSION = APP_VERSION;
