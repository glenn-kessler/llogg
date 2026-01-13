/**
 * Data Service Layer - CRUD operations for all stores
 * Requirements: A-2.0, A-3.0, A-4.0
 */

import { getStore, STORES } from './db.js';

// ============================================================================
// TYPES CRUD
// ============================================================================

/**
 * Get all types
 * @returns {Promise<Array>}
 */
export async function getTypes() {
  const store = await getStore(STORES.TYPES, 'readonly');
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get type by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function getType(id) {
  const store = await getStore(STORES.TYPES, 'readonly');
  const request = store.get(id);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Create new type (F-1.4)
 * @param {Object} type - { name, color, charIcon }
 * @returns {Promise<number>} - ID of created type
 */
export async function createType(type) {
  const store = await getStore(STORES.TYPES, 'readwrite');
  const request = store.add(type);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Update existing type (F-1.4, NF-1.11)
 * @param {number} id
 * @param {Object} updates
 * @returns {Promise<void>}
 */
export async function updateType(id, updates) {
  const store = await getStore(STORES.TYPES, 'readwrite');
  const getRequest = store.get(id);

  return new Promise((resolve, reject) => {
    getRequest.onsuccess = () => {
      const type = getRequest.result;
      if (!type) {
        reject(new Error('Type not found'));
        return;
      }

      const updated = { ...type, ...updates };
      const putRequest = store.put(updated);

      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

/**
 * Delete type (F-1.4)
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteType(id) {
  const store = await getStore(STORES.TYPES, 'readwrite');
  const request = store.delete(id);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// ============================================================================
// DETAILS CRUD
// ============================================================================

/**
 * Get all details
 * @returns {Promise<Array>}
 */
export async function getDetails() {
  const store = await getStore(STORES.DETAILS, 'readonly');
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get details filtered by typeId (F-1.3 - 1:n relationship)
 * @param {number} typeId
 * @returns {Promise<Array>}
 */
export async function getDetailsByType(typeId) {
  const store = await getStore(STORES.DETAILS, 'readonly');
  const index = store.index('typeId');
  const request = index.getAll(typeId);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get detail by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function getDetail(id) {
  const store = await getStore(STORES.DETAILS, 'readonly');
  const request = store.get(id);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Create new detail (F-1.4, F-1.4.1)
 * @param {Object} detail - { typeId, name, color, charIcon, unit }
 * @returns {Promise<number>} - ID of created detail
 */
export async function createDetail(detail) {
  const store = await getStore(STORES.DETAILS, 'readwrite');
  const request = store.add(detail);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Update existing detail (F-1.4, NF-1.11)
 * @param {number} id
 * @param {Object} updates
 * @returns {Promise<void>}
 */
export async function updateDetail(id, updates) {
  const store = await getStore(STORES.DETAILS, 'readwrite');
  const getRequest = store.get(id);

  return new Promise((resolve, reject) => {
    getRequest.onsuccess = () => {
      const detail = getRequest.result;
      if (!detail) {
        reject(new Error('Detail not found'));
        return;
      }

      const updated = { ...detail, ...updates };
      const putRequest = store.put(updated);

      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

/**
 * Delete detail and all associated entries (F-1.4)
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteDetail(id) {
  // First, delete all entries associated with this detail
  const entriesStore = await getStore(STORES.ENTRIES, 'readwrite');
  const allEntriesRequest = entriesStore.getAll();

  return new Promise((resolve, reject) => {
    allEntriesRequest.onsuccess = () => {
      const allEntries = allEntriesRequest.result;
      const entriesToDelete = allEntries.filter(entry => entry.detailId === id);

      // Delete all matching entries
      let deleteCount = 0;
      const deleteNext = () => {
        if (deleteCount >= entriesToDelete.length) {
          // All entries deleted, now delete the detail
          deleteDetailRecord();
          return;
        }

        const deleteRequest = entriesStore.delete(entriesToDelete[deleteCount].id);
        deleteRequest.onsuccess = () => {
          deleteCount++;
          deleteNext();
        };
        deleteRequest.onerror = () => reject(deleteRequest.error);
      };

      const deleteDetailRecord = async () => {
        const detailStore = await getStore(STORES.DETAILS, 'readwrite');
        const request = detailStore.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      };

      if (entriesToDelete.length > 0) {
        deleteNext();
      } else {
        deleteDetailRecord();
      }
    };

    allEntriesRequest.onerror = () => reject(allEntriesRequest.error);
  });
}

// ============================================================================
// ENTRIES CRUD
// ============================================================================

/**
 * Create new entry with automatic timestamp (F-2.1, A-3.0)
 * @param {Object} entry - { typeId, detailId, count, unit }
 * @returns {Promise<number>} - ID of created entry
 */
export async function createEntry({ typeId, detailId, count, unit }) {
  // Validate count (F-1.5 - must be positive integer >= 1)
  if (!count || count < 1) {
    throw new Error('Count must be a positive integer >= 1');
  }

  const store = await getStore(STORES.ENTRIES, 'readwrite');

  // Automatic timestamp (F-2.1)
  const entry = {
    typeId,
    detailId,
    count,
    unit: unit || '', // Custom unit per entry
    timestamp: new Date().toISOString()
  };

  const request = store.add(entry);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Create new entry with custom timestamp
 * @param {Object} entry - { typeId, detailId, count, unit, timestamp }
 * @returns {Promise<number>} - ID of created entry
 */
export async function createEntryWithTimestamp({ typeId, detailId, count, unit, timestamp }) {
  // Validate count (F-1.5 - must be positive integer >= 1)
  if (!count || count < 1) {
    throw new Error('Count must be a positive integer >= 1');
  }

  const store = await getStore(STORES.ENTRIES, 'readwrite');

  const entry = {
    typeId,
    detailId,
    count,
    unit: unit || '', // Custom unit per entry
    timestamp: timestamp || new Date().toISOString()
  };

  const request = store.add(entry);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all entries
 * @returns {Promise<Array>}
 */
export async function getEntries() {
  const store = await getStore(STORES.ENTRIES, 'readonly');
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get entries filtered by criteria (A-4.0 - optimized queries)
 * @param {Object} filters - { typeIds, startTime, endTime }
 * @returns {Promise<Array>}
 */
export async function getEntriesFiltered({ typeIds = [], startTime = null, endTime = null }) {
  const store = await getStore(STORES.ENTRIES, 'readonly');

  // If filtering by both type and time, use compound index
  if (typeIds.length === 1 && startTime) {
    const index = store.index('typeId_timestamp');
    const range = IDBKeyRange.bound(
      [typeIds[0], startTime],
      [typeIds[0], endTime || new Date().toISOString()]
    );
    const request = index.getAll(range);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Otherwise get all and filter in memory (still fast for <100k entries)
  const allEntries = await getEntries();

  return allEntries.filter(entry => {
    // Filter by typeIds
    if (typeIds.length > 0 && !typeIds.includes(entry.typeId)) {
      return false;
    }

    // Filter by time range
    if (startTime && entry.timestamp < startTime) {
      return false;
    }
    if (endTime && entry.timestamp > endTime) {
      return false;
    }

    return true;
  });
}

/**
 * Delete entry
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteEntry(id) {
  const store = await getStore(STORES.ENTRIES, 'readwrite');
  const request = store.delete(id);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// ============================================================================
// CONFIG
// ============================================================================

/**
 * Get config value by key (F-3.2, F-3.3)
 * @param {string} key
 * @returns {Promise<any>}
 */
export async function getConfig(key) {
  const store = await getStore(STORES.CONFIG, 'readonly');
  const request = store.get(key);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result?.value);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Set config value (F-3.2, F-3.3)
 * @param {string} key
 * @param {any} value
 * @returns {Promise<void>}
 */
export async function setConfig(key, value) {
  const store = await getStore(STORES.CONFIG, 'readwrite');
  const request = store.put({ key, value });

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all config
 * @returns {Promise<Object>}
 */
export async function getAllConfig() {
  const store = await getStore(STORES.CONFIG, 'readonly');
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const config = {};
      request.result.forEach(item => {
        config[item.key] = item.value;
      });
      resolve(config);
    };
    request.onerror = () => reject(request.error);
  });
}
