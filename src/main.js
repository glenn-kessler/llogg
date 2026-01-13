/**
 * Main Application Controller
 * Handles navigation, UI logic, and coordinates all components
 */

import { initDB, addDummyData, isInitialized } from './lib/db.js';
import * as dataService from './lib/dataService.js';
import { exportToCSV, downloadCSV, importFromCSV } from './lib/csvService.js';
import { renderBarChart, renderLineChart, renderPieChart } from './components/charts.js';

// ============================================================================
// App State
// ============================================================================

const state = {
  currentPage: 'log',
  selectedType: null,
  selectedDetail: null,
  count: 1,
  types: [],
  details: [],
  entries: []
};

// ============================================================================
// Initialize App
// ============================================================================

async function initApp() {
  try {
    // Initialize database
    const db = await initDB();

    // Check if we need to add dummy data
    const initialized = await isInitialized();
    if (!initialized) {
      await addDummyData(db);
    }

    // Load initial data
    await loadTypes();

    // Setup navigation
    setupNavigation();

    // Setup Log page
    setupLogPage();

    // Setup View page
    setupViewPage();

    // Setup Settings page
    setupSettingsPage();

    // Render initial page
    showPage('log');

  } catch (error) {
    console.error('Failed to initialize app:', error);
    alert('Failed to initialize application. Please refresh the page.');
  }
}

// ============================================================================
// Navigation
// ============================================================================

function setupNavigation() {
  document.getElementById('nav-log').addEventListener('click', () => showPage('log'));
  document.getElementById('nav-view').addEventListener('click', () => showPage('view'));
  document.getElementById('nav-settings').addEventListener('click', () => showPage('settings'));
}

function showPage(pageName) {
  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`nav-${pageName}`).classList.add('active');

  // Update pages
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById(`page-${pageName}`).classList.add('active');

  state.currentPage = pageName;

  // Page-specific actions
  if (pageName === 'log') {
    resetLogPage();
  } else if (pageName === 'view') {
    loadViewPage();
  }
}

// ============================================================================
// Log Page (B-1.0 - Core Logging Flow)
// ============================================================================

function setupLogPage() {
  // Back buttons
  document.getElementById('btn-back-to-type').addEventListener('click', () => showSection('type'));
  document.getElementById('btn-back-to-detail').addEventListener('click', () => showSection('detail'));

  // Count controls
  document.getElementById('btn-count-minus').addEventListener('click', () => {
    state.count = Math.max(1, state.count - 1);
    updateCountDisplay();
  });

  document.getElementById('btn-count-plus').addEventListener('click', () => {
    state.count++;
    updateCountDisplay();
  });

  document.getElementById('input-count').addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    state.count = isNaN(value) || value < 1 ? 1 : value;
    updateCountDisplay();
  });

  // Log entry button
  document.getElementById('btn-log-entry').addEventListener('click', handleLogEntry);

  // Dismiss button (F-1.4.2)
  document.getElementById('btn-dismiss').addEventListener('click', resetLogPage);
}

function resetLogPage() {
  state.selectedType = null;
  state.selectedDetail = null;
  state.count = 1;
  showSection('type');
  renderTypeTiles();
}

function showSection(section) {
  document.querySelectorAll('.selection-section').forEach(s => s.classList.add('hidden'));

  if (section === 'type') {
    document.getElementById('type-selection').classList.remove('hidden');
  } else if (section === 'detail') {
    document.getElementById('detail-selection').classList.remove('hidden');
  } else if (section === 'count') {
    document.getElementById('count-section').classList.remove('hidden');
    updateCountDisplay();
    updateSummary();
  }
}

async function renderTypeTiles() {
  const container = document.getElementById('type-tiles');
  container.innerHTML = '';

  state.types.forEach(type => {
    const tile = createTile(type, () => selectType(type));
    container.appendChild(tile);
  });
}

async function selectType(type) {
  state.selectedType = type;

  // Load details for this type (F-1.3 - filtered by type)
  state.details = await dataService.getDetailsByType(type.id);

  renderDetailTiles();
  showSection('detail');
}

async function renderDetailTiles() {
  const container = document.getElementById('detail-tiles');
  container.innerHTML = '';

  state.details.forEach(detail => {
    const tile = createTile(detail, () => selectDetail(detail));
    container.appendChild(tile);
  });
}

function selectDetail(detail) {
  state.selectedDetail = detail;
  showSection('count');
}

function createTile(item, onClick) {
  const tile = document.createElement('div');
  tile.className = 'tile';
  tile.style.borderColor = item.color;
  tile.addEventListener('click', onClick);

  const icon = document.createElement('div');
  icon.className = 'tile-icon';
  icon.style.color = item.color;
  icon.textContent = item.charIcon;

  const name = document.createElement('div');
  name.className = 'tile-name';
  name.textContent = item.name;

  tile.appendChild(icon);
  tile.appendChild(name);

  return tile;
}

function updateCountDisplay() {
  document.getElementById('input-count').value = state.count;

  const unit = state.selectedDetail?.unit || '';
  document.getElementById('unit-display').textContent = unit ? `Unit: ${unit}` : '';
}

function updateSummary() {
  const content = document.getElementById('summary-content');
  const now = new Date();

  content.innerHTML = `
    <div><strong>Type:</strong> ${state.selectedType.name}</div>
    <div><strong>Details:</strong> ${state.selectedDetail.name}</div>
    <div><strong>Count:</strong> ${state.count} ${state.selectedDetail.unit || ''}</div>
    <div><strong>Time:</strong> ${now.toLocaleString()}</div>
  `;
}

async function handleLogEntry() {
  try {
    await dataService.createEntry({
      typeId: state.selectedType.id,
      detailId: state.selectedDetail.id,
      count: state.count
    });

    // Update config for last used (F-3.1)
    await dataService.setConfig('lastTypeId', state.selectedType.id);
    await dataService.setConfig('lastDetailId', state.selectedDetail.id);

    alert('Entry logged successfully!');
    resetLogPage();

  } catch (error) {
    console.error('Failed to log entry:', error);
    alert('Failed to log entry: ' + error.message);
  }
}

// ============================================================================
// View Page (F-4.x - Data Review & Visualization)
// ============================================================================

function setupViewPage() {
  document.getElementById('btn-apply-filters').addEventListener('click', applyFilters);
}

async function loadViewPage() {
  // Populate type filter checkboxes
  const filterContainer = document.getElementById('filter-types');
  filterContainer.innerHTML = '';

  state.types.forEach(type => {
    const wrapper = document.createElement('div');
    wrapper.className = 'filter-checkbox';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `filter-type-${type.id}`;
    checkbox.value = type.id;
    checkbox.checked = true;

    const label = document.createElement('label');
    label.htmlFor = `filter-type-${type.id}`;
    label.textContent = type.name;
    label.style.color = type.color;

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    filterContainer.appendChild(wrapper);
  });

  // Apply initial filters
  await applyFilters();
}

async function applyFilters() {
  try {
    // Get selected type IDs
    const typeCheckboxes = document.querySelectorAll('#filter-types input[type="checkbox"]:checked');
    const typeIds = Array.from(typeCheckboxes).map(cb => parseInt(cb.value));

    // Get time span
    const timespanValue = parseInt(document.getElementById('filter-timespan-value').value);
    const timespanUnit = document.getElementById('filter-timespan-unit').value;

    // Calculate start time
    const now = new Date();
    const startTime = new Date(now);

    switch (timespanUnit) {
      case 'hours':
        startTime.setHours(now.getHours() - timespanValue);
        break;
      case 'days':
        startTime.setDate(now.getDate() - timespanValue);
        break;
      case 'weeks':
        startTime.setDate(now.getDate() - (timespanValue * 7));
        break;
      case 'months':
        startTime.setMonth(now.getMonth() - timespanValue);
        break;
    }

    // Fetch filtered entries
    const entries = await dataService.getEntriesFiltered({
      typeIds,
      startTime: startTime.toISOString(),
      endTime: now.toISOString()
    });

    // Render chart
    await renderChart(entries, typeIds);

    // Render entries list
    renderEntriesList(entries);

  } catch (error) {
    console.error('Failed to apply filters:', error);
    alert('Failed to load data: ' + error.message);
  }
}

async function renderChart(entries, typeIds) {
  const chartType = document.getElementById('chart-type').value;
  const svg = document.getElementById('chart-svg');

  // Aggregate data by type
  const aggregated = {};

  for (const entry of entries) {
    if (!aggregated[entry.typeId]) {
      const type = state.types.find(t => t.id === entry.typeId);
      aggregated[entry.typeId] = {
        label: type?.name || 'Unknown',
        value: 0,
        color: type?.color || '#95a5a6'
      };
    }
    aggregated[entry.typeId].value += entry.count;
  }

  const chartData = Object.values(aggregated);

  // Render based on chart type
  switch (chartType) {
    case 'bar':
      renderBarChart(svg, chartData);
      break;
    case 'line':
      renderLineChart(svg, chartData);
      break;
    case 'pie':
      renderPieChart(svg, chartData);
      break;
  }
}

async function renderEntriesList(entries) {
  const container = document.getElementById('entries-container');
  container.innerHTML = '';

  if (entries.length === 0) {
    container.innerHTML = '<p style="color: #95a5a6;">No entries found for the selected filters.</p>';
    return;
  }

  // Sort by timestamp (newest first)
  entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Show max 20 entries
  const displayEntries = entries.slice(0, 20);

  for (const entry of displayEntries) {
    const type = state.types.find(t => t.id === entry.typeId);
    const detail = await dataService.getDetail(entry.detailId);

    const item = document.createElement('div');
    item.className = 'entry-item';
    item.style.borderLeftColor = type?.color || '#95a5a6';

    const time = new Date(entry.timestamp).toLocaleString();

    item.innerHTML = `
      <div class="entry-item-header">
        <span class="entry-item-type">${type?.name || 'Unknown'}</span>
        <span class="entry-item-time">${time}</span>
      </div>
      <div class="entry-item-details">
        ${detail?.name || 'Unknown'}: ${entry.count} ${detail?.unit || ''}
      </div>
    `;

    container.appendChild(item);
  }

  if (entries.length > 20) {
    const more = document.createElement('p');
    more.style.color = '#95a5a6';
    more.style.textAlign = 'center';
    more.style.marginTop = '1rem';
    more.textContent = `... and ${entries.length - 20} more entries`;
    container.appendChild(more);
  }
}

// ============================================================================
// Settings Page (F-3.x, C-x)
// ============================================================================

function setupSettingsPage() {
  // Export CSV
  document.getElementById('btn-export-csv').addEventListener('click', handleExportCSV);

  // Import CSV
  document.getElementById('btn-import-csv').addEventListener('click', () => {
    document.getElementById('input-import-csv').click();
  });

  document.getElementById('input-import-csv').addEventListener('change', handleImportCSV);

  // Manage Definitions
  document.getElementById('btn-manage-definitions').addEventListener('click', () => {
    document.getElementById('manage-definitions').classList.remove('hidden');
    loadManageDefinitions();
  });

  document.getElementById('btn-back-settings').addEventListener('click', () => {
    document.getElementById('manage-definitions').classList.add('hidden');
  });

  // Tabs
  document.getElementById('tab-types').addEventListener('click', () => showTab('types'));
  document.getElementById('tab-details').addEventListener('click', () => showTab('details'));

  // Add Type
  document.getElementById('btn-add-type').addEventListener('click', handleAddType);

  // Add Detail
  document.getElementById('btn-add-detail').addEventListener('click', handleAddDetail);
}

async function handleExportCSV() {
  try {
    const csv = await exportToCSV();
    const filename = `life-logger-export-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);
    alert('Data exported successfully!');
  } catch (error) {
    console.error('Export failed:', error);
    alert('Failed to export data: ' + error.message);
  }
}

async function handleImportCSV(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const content = await file.text();
    const result = await importFromCSV(content);

    alert(`Import completed!\nImported: ${result.imported} entries\nErrors: ${result.errors.length}`);

    if (result.errors.length > 0) {
      console.log('Import errors:', result.errors);
    }

    // Reload data
    await loadTypes();

  } catch (error) {
    console.error('Import failed:', error);
    alert('Failed to import data: ' + error.message);
  }
}

async function loadManageDefinitions() {
  await loadTypes();
  showTab('types');
}

function showTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.management-section').forEach(section => section.classList.add('hidden'));

  if (tab === 'types') {
    document.getElementById('tab-types').classList.add('active');
    document.getElementById('types-management').classList.remove('hidden');
    renderTypesList();
  } else if (tab === 'details') {
    document.getElementById('tab-details').classList.add('active');
    document.getElementById('details-management').classList.remove('hidden');
    renderDetailsList();
    populateTypeSelect();
  }
}

async function handleAddType() {
  const name = document.getElementById('input-new-type-name').value.trim();
  const charIcon = document.getElementById('input-new-type-char').value.trim();
  const color = document.getElementById('input-new-type-color').value;

  if (!name || !charIcon) {
    alert('Please fill in all fields');
    return;
  }

  try {
    await dataService.createType({ name, charIcon, color });

    // Clear inputs
    document.getElementById('input-new-type-name').value = '';
    document.getElementById('input-new-type-char').value = '';

    await loadTypes();
    renderTypesList();
    alert('Type added successfully!');

  } catch (error) {
    console.error('Failed to add type:', error);
    alert('Failed to add type: ' + error.message);
  }
}

async function handleAddDetail() {
  const typeId = parseInt(document.getElementById('select-type-for-detail').value);
  const name = document.getElementById('input-new-detail-name').value.trim();
  const charIcon = document.getElementById('input-new-detail-char').value.trim();
  const color = document.getElementById('input-new-detail-color').value;
  const unit = document.getElementById('input-new-detail-unit').value.trim();

  if (!typeId || !name || !charIcon) {
    alert('Please select a type and fill in required fields');
    return;
  }

  try {
    await dataService.createDetail({ typeId, name, charIcon, color, unit });

    // Clear inputs
    document.getElementById('input-new-detail-name').value = '';
    document.getElementById('input-new-detail-char').value = '';
    document.getElementById('input-new-detail-unit').value = '';

    renderDetailsList();
    alert('Detail added successfully!');

  } catch (error) {
    console.error('Failed to add detail:', error);
    alert('Failed to add detail: ' + error.message);
  }
}

async function renderTypesList() {
  const container = document.getElementById('types-list');
  container.innerHTML = '';

  state.types.forEach(type => {
    const row = document.createElement('div');
    row.className = 'item-row';

    row.innerHTML = `
      <div class="item-icon" style="background-color: ${type.color}; color: white;">
        ${type.charIcon}
      </div>
      <div class="item-info">
        <div class="item-name">${type.name}</div>
        <div class="item-meta">ID: ${type.id}</div>
      </div>
      <div class="item-actions">
        <button class="btn-icon danger" data-id="${type.id}">🗑</button>
      </div>
    `;

    row.querySelector('.btn-icon').addEventListener('click', async () => {
      if (confirm(`Delete type "${type.name}"?`)) {
        await dataService.deleteType(type.id);
        await loadTypes();
        renderTypesList();
      }
    });

    container.appendChild(row);
  });
}

async function renderDetailsList() {
  const container = document.getElementById('details-list');
  container.innerHTML = '';

  const allDetails = await dataService.getDetails();

  allDetails.forEach(detail => {
    const type = state.types.find(t => t.id === detail.typeId);

    const row = document.createElement('div');
    row.className = 'item-row';

    row.innerHTML = `
      <div class="item-icon" style="background-color: ${detail.color}; color: white;">
        ${detail.charIcon}
      </div>
      <div class="item-info">
        <div class="item-name">${detail.name}</div>
        <div class="item-meta">Type: ${type?.name || 'Unknown'} | Unit: ${detail.unit || 'None'}</div>
      </div>
      <div class="item-actions">
        <button class="btn-icon danger" data-id="${detail.id}">🗑</button>
      </div>
    `;

    row.querySelector('.btn-icon').addEventListener('click', async () => {
      if (confirm(`Delete detail "${detail.name}"?`)) {
        await dataService.deleteDetail(detail.id);
        renderDetailsList();
      }
    });

    container.appendChild(row);
  });
}

function populateTypeSelect() {
  const select = document.getElementById('select-type-for-detail');
  select.innerHTML = '<option value="">Select Type first...</option>';

  state.types.forEach(type => {
    const option = document.createElement('option');
    option.value = type.id;
    option.textContent = type.name;
    select.appendChild(option);
  });
}

// ============================================================================
// Utility
// ============================================================================

async function loadTypes() {
  state.types = await dataService.getTypes();
}

// ============================================================================
// Start App
// ============================================================================

initApp();
