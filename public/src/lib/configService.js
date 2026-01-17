/**
 * Configuration Import/Export Service
 * Requirements: New feature - human-readable configuration format
 * Format: Indented text with types and details hierarchy
 */

import { getTypes, getDetails, createType, createDetail, updateType, updateDetail } from './dataService.js';
import { APP_VERSION } from '../main.js';

/**
 * Export configuration to human-readable text format
 * Format uses indentation for hierarchy:
 * - 0 spaces: Headers
 * - 2 spaces: Type/Detail group names
 * - 4 spaces: Property names
 * - 6 spaces: Property values (optional, for multiline)
 *
 * @returns {Promise<string>} - Configuration text
 */
export async function exportConfig() {
  const types = await getTypes();
  const details = await getDetails();

  // Group details by type
  const detailsByType = {};
  details.forEach(detail => {
    if (!detailsByType[detail.typeId]) {
      detailsByType[detail.typeId] = [];
    }
    detailsByType[detail.typeId].push(detail);
  });

  let config = 'Life Logger Configuration\n';
  config += `Version: ${APP_VERSION}\n`;
  config += '\n';

  // Export Types section
  config += 'Types:\n';
  types.forEach(type => {
    config += `  ${type.name}\n`;
    config += `    Icon: ${type.charIcon || ''}\n`;
    config += `    Color: ${type.color}\n`;
    config += '\n';
  });

  // Export Details section
  config += 'Details:\n';
  types.forEach(type => {
    const typeDetails = detailsByType[type.id] || [];

    if (typeDetails.length > 0) {
      config += `  ${type.name}\n`;

      typeDetails.forEach(detail => {
        config += `    ${detail.name}\n`;
        config += `      Icon: ${detail.charIcon || ''}\n`;
        config += `      Color: ${detail.color}\n`;
        config += `      Unit: ${detail.unit || ''}\n`;
      });

      config += '\n';
    }
  });

  return config;
}

/**
 * Download configuration file
 * @param {string} config - Configuration text
 * @param {string} filename - Filename for download
 */
export function downloadConfig(config, filename = 'life-logger-config.txt') {
  // UTF-8 encoding
  const blob = new Blob([config], { type: 'text/plain;charset=utf-8;' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();

  URL.revokeObjectURL(link.href);
}

/**
 * Parse configuration text and import
 * @param {string} configContent - Configuration text
 * @returns {Promise<Object>} - { importedTypes: number, importedDetails: number, errors: Array }
 */
export async function importConfig(configContent) {
  const lines = configContent.split('\n');
  const errors = [];

  let currentSection = null;
  let currentType = null;
  let currentTypeName = null;
  let currentDetail = null;
  let currentDetailName = null;

  const typesToCreate = [];
  const detailsToCreate = [];

  console.log('[CONFIG IMPORT] Starting import, total lines:', lines.length);

  // Existing types and details for matching
  const existingTypes = await getTypes();
  const existingDetails = await getDetails();

  const typeByName = {};
  existingTypes.forEach(t => { typeByName[t.name.toLowerCase()] = t; });

  const detailByName = {};
  existingDetails.forEach(d => { detailByName[d.name.toLowerCase()] = d; });

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Skip empty lines
    if (line.trim() === '') {
      continue;
    }

    // Detect indentation level
    const indent = line.length - line.trimStart().length;
    const trimmed = line.trim();

    // Skip header lines
    if (trimmed.startsWith('Life Logger Configuration') || trimmed.startsWith('Version:')) {
      continue;
    }

    // Section headers (0 indent)
    if (indent === 0) {
      if (trimmed === 'Types:') {
        currentSection = 'types';
        currentType = null;
        currentDetail = null;
        continue;
      } else if (trimmed === 'Details:') {
        currentSection = 'details';
        currentType = null;
        currentDetail = null;
        continue;
      }
    }

    // Type/Detail group name (2 spaces)
    if (indent === 2) {
      if (currentSection === 'types') {
        // Start new type
        if (currentType) {
          typesToCreate.push(currentType);
        }
        currentType = {
          name: trimmed,
          charIcon: '',
          color: '#3498db'
        };
        currentTypeName = trimmed;
      } else if (currentSection === 'details') {
        // Type name in Details section
        if (currentDetail) {
          detailsToCreate.push({ ...currentDetail, typeName: currentTypeName });
        }
        currentDetail = null;
        currentTypeName = trimmed;
      }
      continue;
    }

    // Detail name (4 spaces in Details section)
    if (indent === 4 && currentSection === 'details') {
      // Save previous detail if exists
      if (currentDetail) {
        detailsToCreate.push({ ...currentDetail, typeName: currentTypeName });
      }

      // Start new detail
      currentDetail = {
        name: trimmed,
        charIcon: '',
        color: '#2ecc71',
        unit: ''
      };
      currentDetailName = trimmed;
      continue;
    }

    // Property line (4 spaces in Types, 6 spaces in Details)
    if ((indent === 4 && currentSection === 'types') || (indent === 6 && currentSection === 'details')) {
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex === -1) {
        errors.push({ line: lineNum, error: 'Property line missing colon' });
        continue;
      }

      const propName = trimmed.substring(0, colonIndex).trim();
      const propValue = trimmed.substring(colonIndex + 1).trim();

      if (currentSection === 'types' && currentType) {
        if (propName === 'Icon') {
          currentType.charIcon = propValue;
        } else if (propName === 'Color') {
          currentType.color = propValue;
        }
      } else if (currentSection === 'details' && currentDetail) {
        if (propName === 'Icon') {
          currentDetail.charIcon = propValue;
        } else if (propName === 'Color') {
          currentDetail.color = propValue;
        } else if (propName === 'Unit') {
          currentDetail.unit = propValue;
        }
      }
      continue;
    }
  }

  // Save last type/detail
  if (currentType) {
    typesToCreate.push(currentType);
  }
  if (currentDetail) {
    detailsToCreate.push({ ...currentDetail, typeName: currentTypeName });
  }

  console.log('[CONFIG IMPORT] Parsed types:', typesToCreate);
  console.log('[CONFIG IMPORT] Parsed details:', detailsToCreate);

  // Import types
  let importedTypes = 0;
  let updatedTypes = 0;
  const typeIdMap = {}; // Map from name to ID for detail creation

  console.log('[CONFIG IMPORT] Creating types, count:', typesToCreate.length);

  for (const type of typesToCreate) {
    try {
      const existing = typeByName[type.name.toLowerCase()];

      if (existing) {
        // Update existing type
        console.log('[CONFIG IMPORT] Updating existing type:', type.name);
        await updateType(existing.id, {
          charIcon: type.charIcon,
          color: type.color
        });
        typeIdMap[type.name] = existing.id;
        updatedTypes++;
      } else {
        // Create new type
        console.log('[CONFIG IMPORT] Creating new type:', type.name);
        const id = await createType(type);
        typeIdMap[type.name] = id;
        importedTypes++;
      }
    } catch (error) {
      console.error('[CONFIG IMPORT] Error creating type:', type.name, error);
      errors.push({ type: type.name, error: error.message });
    }
  }

  // Import details
  let importedDetails = 0;
  let updatedDetails = 0;

  console.log('[CONFIG IMPORT] Creating details, count:', detailsToCreate.length);

  for (const detail of detailsToCreate) {
    try {
      const typeId = typeIdMap[detail.typeName];

      if (!typeId) {
        console.error('[CONFIG IMPORT] Type not found for detail:', detail.name, 'type:', detail.typeName);
        errors.push({ detail: detail.name, error: `Type '${detail.typeName}' not found` });
        continue;
      }

      const existing = detailByName[detail.name.toLowerCase()];

      if (existing && existing.typeId === typeId) {
        // Update existing detail
        console.log('[CONFIG IMPORT] Updating existing detail:', detail.name);
        await updateDetail(existing.id, {
          charIcon: detail.charIcon,
          color: detail.color,
          unit: detail.unit
        });
        updatedDetails++;
      } else {
        // Create new detail
        console.log('[CONFIG IMPORT] Creating new detail:', detail.name, 'for type:', detail.typeName);
        await createDetail({
          typeId: typeId,
          name: detail.name,
          charIcon: detail.charIcon,
          color: detail.color,
          unit: detail.unit
        });
        importedDetails++;
      }
    } catch (error) {
      console.error('[CONFIG IMPORT] Error creating detail:', detail.name, error);
      errors.push({ detail: detail.name, error: error.message });
    }
  }

  console.log('[CONFIG IMPORT] Import complete. Types:', importedTypes, 'updated:', updatedTypes, 'Details:', importedDetails, 'updated:', updatedDetails);

  return {
    importedTypes,
    updatedTypes,
    importedDetails,
    updatedDetails,
    errors
  };
}
