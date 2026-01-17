/**
 * CSV Import/Export Service
 * Requirements: F-1.7, F-2.2, C-2.0, C-3.0, NF-1.7, NF-1.8, NF-1.9
 * CSV Format: id;timestamp;type_name;detail_name;count;unit;latitude;longitude;accuracy
 */

import { getEntries, getTypes, getDetails, createEntry, createEntryWithTimestamp, getType, getDetail } from './dataService.js';

/**
 * Export all entries to CSV format (F-1.7, NF-1.7-1.9)
 * @returns {Promise<string>} - CSV string
 */
export async function exportToCSV() {
  const entries = await getEntries();
  const types = await getTypes();
  const details = await getDetails();

  // Create lookup maps for performance
  const typeMap = {};
  types.forEach(t => { typeMap[t.id] = t; });

  const detailMap = {};
  details.forEach(d => { detailMap[d.id] = d; });

  // CSV Header (NF-1.7, F-2.2)
  let csv = 'id;timestamp;type_name;detail_name;count;unit;latitude;longitude;accuracy\n';

  // Add entries
  entries.forEach(entry => {
    const type = typeMap[entry.typeId];
    const detail = detailMap[entry.detailId];

    if (!type || !detail) return; // Skip orphaned entries

    const row = [
      entry.id,
      entry.timestamp,
      escapeCsvField(type.name),
      escapeCsvField(detail.name),
      entry.count,
      escapeCsvField(entry.unit || ''), // Use unit from entry, not detail
      entry.latitude || '', // GPS latitude (F-2.2)
      entry.longitude || '', // GPS longitude (F-2.2)
      entry.accuracy || '' // GPS accuracy in meters (F-2.2)
    ].join(';'); // Semicolon delimiter (NF-1.8)

    csv += row + '\n';
  });

  return csv;
}

/**
 * Download CSV file (F-1.7)
 * @param {string} csv
 * @param {string} filename
 */
export function downloadCSV(csv, filename = 'life-logger-export.csv') {
  // UTF-8 BOM for Excel compatibility (NF-1.9)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();

  URL.revokeObjectURL(link.href);
}

/**
 * Parse CSV string and import entries (NF-1.12)
 * @param {string} csvContent
 * @returns {Promise<Object>} - { imported: number, errors: Array }
 */
export async function importFromCSV(csvContent) {
  const types = await getTypes();
  const details = await getDetails();

  // Create reverse lookup maps (name -> object)
  const typeByName = {};
  types.forEach(t => { typeByName[t.name.toLowerCase()] = t; });

  const detailByName = {};
  details.forEach(d => { detailByName[d.name.toLowerCase()] = d; });

  const lines = csvContent.split('\n').map(l => l.trim()).filter(l => l);

  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  // Validate header
  const header = lines[0].toLowerCase();
  if (!header.includes('timestamp') || !header.includes('type_name') || !header.includes('detail_name')) {
    throw new Error('Invalid CSV format. Expected columns: id;timestamp;type_name;detail_name;count;unit;latitude;longitude;accuracy');
  }

  const imported = [];
  const errors = [];

  // Process data rows (skip header)
  for (let i = 1; i < lines.length; i++) {
    try {
      const row = parseCSVLine(lines[i]);

      if (row.length < 5) {
        errors.push({ line: i + 1, error: 'Incomplete row' });
        continue;
      }

      const [id, timestamp, typeName, detailName, count, unit, latitude, longitude, accuracy] = row;

      // Find matching type and detail
      const type = typeByName[typeName.toLowerCase()];
      const detail = detailByName[detailName.toLowerCase()];

      if (!type) {
        errors.push({ line: i + 1, error: `Type '${typeName}' not found` });
        continue;
      }

      if (!detail) {
        errors.push({ line: i + 1, error: `Detail '${detailName}' not found` });
        continue;
      }

      // Verify detail belongs to type
      if (detail.typeId !== type.id) {
        errors.push({ line: i + 1, error: `Detail '${detailName}' does not belong to Type '${typeName}'` });
        continue;
      }

      // Validate count
      const countNum = parseFloat(count);
      if (isNaN(countNum) || countNum < 1) {
        errors.push({ line: i + 1, error: `Invalid count: ${count}` });
        continue;
      }

      // Parse location data if present
      const lat = latitude && latitude.trim() ? parseFloat(latitude) : null;
      const lon = longitude && longitude.trim() ? parseFloat(longitude) : null;
      const acc = accuracy && accuracy.trim() ? parseFloat(accuracy) : null;

      // Create entry with location data and timestamp from CSV (F-2.2)
      const entryId = await createEntryWithTimestamp({
        typeId: type.id,
        detailId: detail.id,
        count: countNum,
        unit: unit || '',
        timestamp: timestamp, // Use timestamp from CSV
        latitude: lat,
        longitude: lon,
        accuracy: acc
      });

      imported.push(entryId);

    } catch (error) {
      errors.push({ line: i + 1, error: error.message });
    }
  }

  return {
    imported: imported.length,
    errors
  };
}

/**
 * Parse CSV line handling quoted fields with semicolons
 * @param {string} line
 * @returns {Array<string>}
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ';' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Escape CSV field if it contains special characters
 * @param {string} field
 * @returns {string}
 */
function escapeCsvField(field) {
  if (!field) return '';

  const str = String(field);

  // If contains semicolon, quotes, or newline, wrap in quotes
  if (str.includes(';') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }

  return str;
}
