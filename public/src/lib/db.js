/**
 * IndexedDB Schema and Database Management
 * Requirements: F-1.6, NF-1.1, NF-1.5, NF-1.6
 */

const DB_NAME = 'LifeLoggerDB';
const DB_VERSION = 1;

// Object Store Names
export const STORES = {
  TYPES: 'types',
  DETAILS: 'details',
  ENTRIES: 'entries',
  CONFIG: 'config'
};

/**
 * Initialize IndexedDB with schema
 * @returns {Promise<IDBDatabase>}
 */
export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Types Object Store
      if (!db.objectStoreNames.contains(STORES.TYPES)) {
        const typesStore = db.createObjectStore(STORES.TYPES, {
          keyPath: 'id',
          autoIncrement: true
        });
        typesStore.createIndex('name', 'name', { unique: false });
      }

      // Details Object Store (1:n relationship with Types via typeId)
      if (!db.objectStoreNames.contains(STORES.DETAILS)) {
        const detailsStore = db.createObjectStore(STORES.DETAILS, {
          keyPath: 'id',
          autoIncrement: true
        });
        detailsStore.createIndex('typeId', 'typeId', { unique: false });
        detailsStore.createIndex('name', 'name', { unique: false });
      }

      // Entries Object Store
      if (!db.objectStoreNames.contains(STORES.ENTRIES)) {
        const entriesStore = db.createObjectStore(STORES.ENTRIES, {
          keyPath: 'id',
          autoIncrement: true
        });
        // Indexes for fast queries (A-4.0)
        entriesStore.createIndex('timestamp', 'timestamp', { unique: false });
        entriesStore.createIndex('typeId', 'typeId', { unique: false });
        entriesStore.createIndex('detailId', 'detailId', { unique: false });
        entriesStore.createIndex('typeId_timestamp', ['typeId', 'timestamp'], { unique: false });
      }

      // Config Object Store (key-value pairs)
      if (!db.objectStoreNames.contains(STORES.CONFIG)) {
        db.createObjectStore(STORES.CONFIG, { keyPath: 'key' });
      }
    };
  });
}

/**
 * Generic transaction helper
 * @param {string} storeName
 * @param {string} mode - 'readonly' or 'readwrite'
 * @returns {Promise<IDBObjectStore>}
 */
export async function getStore(storeName, mode = 'readonly') {
  const db = await initDB();
  const transaction = db.transaction(storeName, mode);
  return transaction.objectStore(storeName);
}

/**
 * Add dummy data for initial setup (F-1.2 requirement)
 * @param {IDBDatabase} db
 */
export async function addDummyData(db) {
  const transaction = db.transaction([STORES.TYPES, STORES.DETAILS, STORES.CONFIG], 'readwrite');

  const typesStore = transaction.objectStore(STORES.TYPES);
  const detailsStore = transaction.objectStore(STORES.DETAILS);
  const configStore = transaction.objectStore(STORES.CONFIG);

  // Dummy Types
  const dummyTypes = [
    { name: 'Mood', color: '#3498db', charIcon: '😊' },
    { name: 'Activity', color: '#2ecc71', charIcon: '🏃' },
    { name: 'Food', color: '#e74c3c', charIcon: '🍽️' },
    { name: 'Sleep', color: '#9b59b6', charIcon: '😴' }
  ];

  // Add types and capture IDs
  const typeIds = {};
  for (const type of dummyTypes) {
    const request = typesStore.add(type);
    await new Promise((resolve, reject) => {
      request.onsuccess = () => {
        typeIds[type.name] = request.result;
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Dummy Details (linked to Types via typeId)
  const dummyDetails = [
    // Mood details
    { typeId: typeIds['Mood'], name: 'Happy', color: '#f1c40f', charIcon: '😊', unit: '' },
    { typeId: typeIds['Mood'], name: 'Sad', color: '#3498db', charIcon: '😢', unit: '' },
    { typeId: typeIds['Mood'], name: 'Neutral', color: '#95a5a6', charIcon: '😐', unit: '' },
    { typeId: typeIds['Mood'], name: 'Angry', color: '#e74c3c', charIcon: '😠', unit: '' },
    { typeId: typeIds['Mood'], name: 'Frightened', color: '#9b59b6', charIcon: '😨', unit: '' },
    { typeId: typeIds['Mood'], name: 'Energetic', color: '#e67e22', charIcon: '⚡', unit: '' },
    { typeId: typeIds['Mood'], name: 'Tired', color: '#7f8c8d', charIcon: '😴', unit: '' },

    // Activity details
    { typeId: typeIds['Activity'], name: 'Running', color: '#e74c3c', charIcon: '🏃', unit: 'Minutes' },
    { typeId: typeIds['Activity'], name: 'Cycling', color: '#3498db', charIcon: '🚴', unit: 'km' },
    { typeId: typeIds['Activity'], name: 'Walking', color: '#2ecc71', charIcon: '🚶', unit: 'Minutes' },
    { typeId: typeIds['Activity'], name: 'Gym', color: '#e67e22', charIcon: '💪', unit: 'Minutes' },

    // Food details
    { typeId: typeIds['Food'], name: 'Breakfast', color: '#f39c12', charIcon: '🥐', unit: '' },
    { typeId: typeIds['Food'], name: 'Lunch', color: '#e74c3c', charIcon: '🍱', unit: '' },
    { typeId: typeIds['Food'], name: 'Dinner', color: '#c0392b', charIcon: '🍝', unit: '' },
    { typeId: typeIds['Food'], name: 'Snack', color: '#f1c40f', charIcon: '🍪', unit: '' },

    // Sleep details
    { typeId: typeIds['Sleep'], name: 'Night Sleep', color: '#34495e', charIcon: '🌙', unit: 'Hours' },
    { typeId: typeIds['Sleep'], name: 'Nap', color: '#7f8c8d', charIcon: '💤', unit: 'Minutes' }
  ];

  for (const detail of dummyDetails) {
    detailsStore.add(detail);
  }

  // Default config
  configStore.put({ key: 'version', value: '1.0.0' });
  configStore.put({ key: 'initialized', value: true });

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Check if database is initialized with data
 * @returns {Promise<boolean>}
 */
export async function isInitialized() {
  try {
    const store = await getStore(STORES.CONFIG, 'readonly');
    const request = store.get('initialized');

    return new Promise((resolve) => {
      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => resolve(false);
    });
  } catch (error) {
    return false;
  }
}
