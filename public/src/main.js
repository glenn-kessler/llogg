/**
 * Main Application Controller
 * Handles navigation, UI logic, and coordinates all components
 */

import { initDB, addDummyData, isInitialized } from './lib/db.js';
import * as dataService from './lib/dataService.js';
import { exportToCSV, downloadCSV, importFromCSV } from './lib/csvService.js';
import { exportConfig, downloadConfig, importConfig } from './lib/configService.js';
import { renderBarChart, renderLineChart, renderPieChart, renderGroupedBarChart, renderMultiLineChart, renderHorizontalBarChart, calculateAutoStepSize, aggregateByTimeSteps } from './components/charts.js';

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
  entries: [],
  detailCounts: {}, // Track counts for each detail: { detailId: count }
  detailUnits: {}, // Track custom units for each detail: { detailId: unit }
  lastUpdatedTypeId: null, // Track which type was just updated
  typeLastUsed: {}, // Track last used timestamp per type: { typeId: timestamp }
  configMode: false, // Track if in config mode
  draggedDetailId: null, // Track which detail is being dragged
  timestampOffset: 0, // Offset in milliseconds to add/subtract from current time
  timestampAdjustDetailId: null, // Track which detail's timestamp is being adjusted
  timestampSign: -1, // Current sign: -1 for subtract, 1 for add
  markedForDeletion: new Set(), // Track detail IDs marked for deletion
  checkedDetails: new Set(), // Track detail IDs checked for bulk actions
  editingDetail: null // Track which detail is being edited for icon/color
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
  document.getElementById('nav-about').addEventListener('click', () => showPage('about'));
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
  // Back button
  document.getElementById('btn-back-to-type').addEventListener('click', () => {
    if (state.configMode) {
      exitConfigMode();
    }
    resetDetailCounts();
    showSection('type');
  });

  // Commit log button - handles both normal commit and config store
  document.getElementById('btn-commit-log').addEventListener('click', () => {
    if (state.configMode) {
      handleStoreConfig();
    } else {
      handleCommitLog();
    }
  });

  // Add Detail Dialog buttons
  document.getElementById('btn-dialog-cancel').addEventListener('click', hideAddDetailDialog);
  document.getElementById('btn-dialog-save').addEventListener('click', handleSaveNewDetail);

  // Add Type Dialog buttons
  document.getElementById('btn-add-type-cancel').addEventListener('click', hideAddTypeDialog);
  document.getElementById('btn-add-type-save').addEventListener('click', handleSaveNewType);

  // Delete Type Dialog buttons
  document.getElementById('btn-delete-type-cancel').addEventListener('click', hideDeleteTypeDialog);
  document.getElementById('btn-delete-type-confirm').addEventListener('click', handleConfirmDeleteType);
  document.getElementById('select-type-to-delete').addEventListener('change', handleTypeSelectionForDelete);
  document.getElementById('delete-details-checkbox').addEventListener('change', handleDeleteDetailsCheckboxChange);

  // Move Details Dialog buttons
  document.getElementById('btn-move-cancel').addEventListener('click', hideMoveDetailsDialog);
  document.getElementById('btn-move-confirm').addEventListener('click', handleConfirmMoveDetails);
  document.getElementById('select-target-type').addEventListener('change', handleTargetTypeSelection);

  // Edit Detail Dialog buttons
  document.getElementById('btn-edit-detail-cancel').addEventListener('click', hideEditDetailDialog);
  document.getElementById('btn-edit-detail-save').addEventListener('click', handleSaveEditDetail);
  document.getElementById('edit-detail-icon').addEventListener('input', updateEditDetailPreview);
  document.getElementById('edit-detail-color').addEventListener('input', updateEditDetailPreview);

  // Timestamp Dialog buttons
  document.getElementById('btn-timestamp-cancel').addEventListener('click', hideTimestampDialog);
  document.getElementById('btn-timestamp-apply').addEventListener('click', applyTimestampOffset);

  // Sign toggle button
  document.getElementById('btn-timestamp-sign').addEventListener('click', toggleTimestampSign);

  // Reset to now button
  document.getElementById('btn-timestamp-now').addEventListener('click', resetTimestampToNow);

  // Timestamp option buttons (incremental)
  document.querySelectorAll('.btn-timestamp[data-value]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const value = parseInt(e.target.dataset.value);
      addTimestampIncrement(value);
    });
  });

  // Long-press detection on detail selection section
  let detailSectionPressTimer;
  let detailSectionPressStarted = false;

  const detailSection = document.getElementById('detail-selection');

  const startDetailSectionPress = (e) => {
    // Don't trigger if clicking on buttons or inputs
    if (e.target.closest('button, input')) return;

    detailSectionPressStarted = true;
    detailSectionPressTimer = setTimeout(() => {
      if (detailSectionPressStarted && !state.configMode) {
        enterConfigMode();
      }
    }, 1000); // 1 second
  };

  const endDetailSectionPress = () => {
    if (detailSectionPressTimer) {
      clearTimeout(detailSectionPressTimer);
    }
    detailSectionPressStarted = false;
  };

  detailSection.addEventListener('touchstart', startDetailSectionPress);
  detailSection.addEventListener('touchend', endDetailSectionPress);
  detailSection.addEventListener('touchmove', endDetailSectionPress);
  detailSection.addEventListener('mousedown', startDetailSectionPress);
  detailSection.addEventListener('mouseup', endDetailSectionPress);
  detailSection.addEventListener('mouseleave', endDetailSectionPress);
}

function resetLogPage() {
  state.selectedType = null;
  resetDetailCounts();
  showSection('type');
  renderTypeTiles();

  // Remove highlight after 8 seconds
  if (state.lastUpdatedTypeId) {
    setTimeout(() => {
      state.lastUpdatedTypeId = null;
      renderTypeTiles();
    }, 8000);
  }
}

function resetDetailCounts() {
  state.detailCounts = {};
  state.detailUnits = {};
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

  // Load last used timestamps from config
  for (const type of state.types) {
    const lastUsed = await dataService.getConfig(`lastUsed_type_${type.id}`);
    if (lastUsed) {
      state.typeLastUsed[type.id] = lastUsed;
    }
  }

  state.types.forEach(type => {
    const tile = createTypeTile(type);
    container.appendChild(tile);
  });

  // Type management buttons at bottom (in separate container)
  const managementContainer = document.getElementById('type-management-container');
  managementContainer.innerHTML = ''; // Clear previous buttons

  const managementBar = document.createElement('div');
  managementBar.className = 'type-management-bar';

  const addTypeBtn = document.createElement('button');
  addTypeBtn.className = 'btn-manage-type btn-add-type';
  addTypeBtn.textContent = '+ Add Type';
  addTypeBtn.addEventListener('click', showAddTypeDialog);

  const deleteTypeBtn = document.createElement('button');
  deleteTypeBtn.className = 'btn-manage-type btn-delete-type';
  deleteTypeBtn.textContent = '− Delete Type';
  deleteTypeBtn.addEventListener('click', showDeleteTypeDialog);

  managementBar.appendChild(addTypeBtn);
  managementBar.appendChild(deleteTypeBtn);
  managementContainer.appendChild(managementBar);
}

function createTypeTile(type) {
  const tile = document.createElement('div');
  tile.className = 'tile';
  tile.style.borderColor = type.color;

  // Highlight if just updated
  if (state.lastUpdatedTypeId === type.id) {
    tile.classList.add('tile-recently-updated');
  }

  const icon = document.createElement('div');
  icon.className = 'tile-icon';
  icon.style.color = type.color;
  icon.textContent = type.charIcon;

  const name = document.createElement('div');
  name.className = 'tile-name';
  name.textContent = type.name;

  tile.appendChild(icon);
  tile.appendChild(name);

  // Long-press detection
  let pressTimer;
  let pressStarted = false;
  let startX = 0;
  let startY = 0;
  const MOVE_THRESHOLD = 10; // pixels - only cancel if moved more than this

  const startPress = (e) => {
    e.preventDefault();
    pressStarted = true;

    // Record starting position
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX;
    startY = touch.clientY;

    pressTimer = setTimeout(() => {
      if (pressStarted) {
        showTypeInfo(type, tile);
      }
    }, 1000); // 1 second
  };

  const endPress = (e) => {
    if (pressTimer) {
      clearTimeout(pressTimer);
    }
    if (pressStarted && !tile.querySelector('.type-info-popup')) {
      // Normal click - select type
      selectType(type);
    }
    pressStarted = false;
  };

  const cancelPress = (e) => {
    // Only cancel if finger moved significantly
    const touch = e.touches ? e.touches[0] : e;
    const deltaX = Math.abs(touch.clientX - startX);
    const deltaY = Math.abs(touch.clientY - startY);

    if (deltaX > MOVE_THRESHOLD || deltaY > MOVE_THRESHOLD) {
      if (pressTimer) {
        clearTimeout(pressTimer);
      }
      pressStarted = false;
    }
  };

  // Touch events
  tile.addEventListener('touchstart', startPress);
  tile.addEventListener('touchend', endPress);
  tile.addEventListener('touchmove', cancelPress);

  // Mouse events
  tile.addEventListener('mousedown', startPress);
  tile.addEventListener('mouseup', endPress);
  tile.addEventListener('mouseleave', cancelPress);

  return tile;
}

function showTypeInfo(type, tileElement) {
  // Remove any existing popups
  document.querySelectorAll('.type-info-popup').forEach(p => p.remove());

  const popup = document.createElement('div');
  popup.className = 'type-info-popup';

  const lastUsed = state.typeLastUsed[type.id];
  const timeAgo = lastUsed ? getTimeAgo(lastUsed) : 'NEVER';

  popup.innerHTML = `
    <div class="type-info-header">${type.charIcon} ${type.name}</div>
    <div class="type-info-time">Last used: ${timeAgo}</div>
  `;

  // Position popup
  tileElement.style.position = 'relative';
  tileElement.appendChild(popup);

  // Close popup on click anywhere
  setTimeout(() => {
    const closePopup = () => {
      popup.remove();
      document.removeEventListener('click', closePopup);
      document.removeEventListener('touchstart', closePopup);
    };
    document.addEventListener('click', closePopup);
    document.addEventListener('touchstart', closePopup);
  }, 100);
}

function getTimeAgo(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return `${diffSeconds}s ago`;
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return `${diffDays}d ago`;
  }
}

async function selectType(type) {
  state.selectedType = type;
  state.configMode = false; // Reset config mode when selecting type

  // Load details for this type (F-1.3 - filtered by type)
  state.details = await dataService.getDetailsByType(type.id);

  // Load saved order if exists
  const savedOrder = await dataService.getConfig(`detailOrder_type_${type.id}`);
  if (savedOrder && Array.isArray(savedOrder)) {
    // Reorder details based on saved order
    const detailsById = {};
    state.details.forEach(d => {
      detailsById[d.id] = d;
    });

    const orderedDetails = [];
    savedOrder.forEach(id => {
      if (detailsById[id]) {
        orderedDetails.push(detailsById[id]);
        delete detailsById[id];
      }
    });

    // Append any new details not in saved order
    Object.values(detailsById).forEach(d => {
      orderedDetails.push(d);
    });

    state.details = orderedDetails;
  }

  // Reset counts
  resetDetailCounts();

  renderDetailList();
  showSection('detail');
}

function renderDetailList() {
  const container = document.getElementById('detail-list');
  container.innerHTML = '';

  // Add "Add New Detail" button or "Leave Config Mode" button
  const actionBtn = document.createElement('button');
  if (state.configMode) {
    actionBtn.className = 'btn-leave-config-mode';
    actionBtn.textContent = '← Leave Config Mode';
    actionBtn.addEventListener('click', exitConfigMode);
    container.appendChild(actionBtn);

    // Add "Move [Type]" button in config mode
    const moveBtn = document.createElement('button');
    moveBtn.className = 'btn-move-details';
    moveBtn.id = 'btn-move-details';
    moveBtn.textContent = `Move ${state.selectedType.name}`;
    moveBtn.disabled = true; // Initially disabled
    moveBtn.addEventListener('click', showMoveDetailsDialog);
    container.appendChild(moveBtn);

    // Add "Delete Checked" button in config mode
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete-checked';
    deleteBtn.id = 'btn-delete-checked';
    deleteBtn.textContent = '🗑 Delete Checked';
    deleteBtn.disabled = true; // Initially disabled
    deleteBtn.addEventListener('click', confirmDeleteCheckedDetails);
    container.appendChild(deleteBtn);
  } else {
    actionBtn.className = 'btn-add-new-detail';
    actionBtn.textContent = `+ Add New ${state.selectedType.name}`;
    actionBtn.addEventListener('click', () => showAddDetailDialog());
    container.appendChild(actionBtn);
  }

  state.details.forEach(detail => {
    const row = createDetailRow(detail);
    container.appendChild(row);
  });

  // Config mode indicator at bottom
  if (state.configMode) {
    const indicator = document.createElement('div');
    indicator.className = 'config-mode-indicator';
    indicator.textContent = '⚙️ CONFIG MODE';
    container.appendChild(indicator);
  }

  updateCommitButton();
}

function createDetailRow(detail) {
  const row = document.createElement('div');
  row.className = 'detail-row';
  row.style.borderLeftColor = detail.color;
  row.dataset.detailId = detail.id;

  if (state.configMode) {
    row.classList.add('config-mode');

    // Add checkbox wrapper
    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.className = 'detail-row-checkbox-wrapper';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'detail-row-checkbox';
    checkbox.checked = state.checkedDetails.has(detail.id);
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        state.checkedDetails.add(detail.id);
      } else {
        state.checkedDetails.delete(detail.id);
      }
      updateConfigModeButtons();
    });

    checkboxWrapper.appendChild(checkbox);
    row.insertBefore(checkboxWrapper, row.firstChild);

    row.draggable = true;

    // Drag event handlers
    row.addEventListener('dragstart', (e) => {
      state.draggedDetailId = detail.id;
      row.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    row.addEventListener('dragend', () => {
      row.classList.remove('dragging');
      state.draggedDetailId = null;
    });

    row.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      const draggingRow = document.querySelector('.dragging');
      if (draggingRow && draggingRow !== row) {
        const rect = row.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;

        if (e.clientY < midpoint) {
          row.parentNode.insertBefore(draggingRow, row);
        } else {
          row.parentNode.insertBefore(draggingRow, row.nextSibling);
        }
      }
    });

    row.addEventListener('drop', (e) => {
      e.preventDefault();
    });
  }

  // Icon
  const icon = document.createElement('div');
  icon.className = 'detail-row-icon';
  icon.style.backgroundColor = detail.color;
  icon.style.color = 'white';
  icon.textContent = detail.charIcon;

  // In config mode, make icon clickable to edit
  if (state.configMode) {
    icon.style.cursor = 'pointer';
    icon.title = 'Click to edit icon and color';
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      showEditDetailDialog(detail);
    });
  }

  // Info (Name only)
  const info = document.createElement('div');
  info.className = 'detail-row-info';

  const name = document.createElement('div');
  name.className = 'detail-row-name';
  name.textContent = detail.name;

  info.appendChild(name);

  row.appendChild(icon);
  row.appendChild(info);

  if (state.configMode) {
    // Config mode: Show unit input, drag handle, and delete button
    const unitWrapper = document.createElement('div');
    unitWrapper.className = 'detail-row-unit-wrapper';

    const unitInput = document.createElement('input');
    unitInput.type = 'text';
    unitInput.className = 'detail-row-unit-input';
    unitInput.placeholder = 'unit';
    unitInput.value = detail.unit || '';
    unitInput.dataset.detailId = detail.id;
    unitInput.addEventListener('input', (e) => {
      // Store the unit change temporarily
      if (!state.detailUnitChanges) {
        state.detailUnitChanges = {};
      }
      state.detailUnitChanges[detail.id] = e.target.value;
    });

    unitWrapper.appendChild(unitInput);
    row.appendChild(unitWrapper);

    const dragHandle = document.createElement('div');
    dragHandle.className = 'detail-row-drag-handle';
    dragHandle.textContent = '☰';
    row.appendChild(dragHandle);
  } else {
    // Normal mode: Show controls and unit display (only if unit is set)

    // Clock icon button
    const clockBtn = document.createElement('button');
    clockBtn.className = 'btn-clock-icon';
    clockBtn.textContent = '🕐';
    clockBtn.title = 'Adjust timestamp';
    clockBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showTimestampDialog(detail.id);
    });
    row.appendChild(clockBtn);

    const controls = document.createElement('div');
    controls.className = 'detail-row-controls';

    const minusBtn = document.createElement('button');
    minusBtn.className = 'btn-count-small';
    minusBtn.textContent = '−';
    minusBtn.addEventListener('click', () => {
      decrementDetail(detail.id);
    });

    const countDisplay = document.createElement('div');
    countDisplay.className = 'detail-row-count';
    countDisplay.id = `count-${detail.id}`;
    countDisplay.textContent = state.detailCounts[detail.id] || 0;

    const plusBtn = document.createElement('button');
    plusBtn.className = 'btn-count-small';
    plusBtn.textContent = '+';
    plusBtn.addEventListener('click', () => {
      incrementDetail(detail.id);
    });

    controls.appendChild(minusBtn);
    controls.appendChild(countDisplay);
    controls.appendChild(plusBtn);

    row.appendChild(controls);

    // Unit display (only if detail has a unit set)
    if (detail.unit && detail.unit.trim()) {
      const unitWrapper = document.createElement('div');
      unitWrapper.className = 'detail-row-unit-wrapper';

      const unitInput = document.createElement('input');
      unitInput.type = 'text';
      unitInput.className = 'detail-row-unit-input';
      unitInput.placeholder = detail.unit;
      unitInput.value = state.detailUnits[detail.id] || '';
      unitInput.addEventListener('input', (e) => {
        state.detailUnits[detail.id] = e.target.value;
      });

      unitWrapper.appendChild(unitInput);
      row.appendChild(unitWrapper);
    }
  }

  return row;
}

function incrementDetail(detailId) {
  if (!state.detailCounts[detailId]) {
    state.detailCounts[detailId] = 0;
  }
  state.detailCounts[detailId]++;
  updateDetailCount(detailId);
  updateCommitButton();
}

function decrementDetail(detailId) {
  if (state.detailCounts[detailId] && state.detailCounts[detailId] > 0) {
    state.detailCounts[detailId]--;
    updateDetailCount(detailId);
    updateCommitButton();
  }
}

function updateDetailCount(detailId) {
  const countDisplay = document.getElementById(`count-${detailId}`);
  if (countDisplay) {
    countDisplay.textContent = state.detailCounts[detailId] || 0;
  }
}

function updateCommitButton() {
  const commitBtn = document.getElementById('btn-commit-log');

  if (state.configMode) {
    commitBtn.textContent = 'Store Config';
    commitBtn.disabled = false;
  } else {
    commitBtn.textContent = 'Commit Log';
    const hasAnyCounts = Object.values(state.detailCounts).some(count => count > 0);
    commitBtn.disabled = !hasAnyCounts;
  }
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

async function handleCommitLog() {
  try {
    // Apply timestamp offset
    const adjustedTime = new Date(Date.now() + state.timestampOffset);
    const timestamp = adjustedTime.toISOString();

    // Capture GPS location (F-2.2)
    let gpsData = null;
    if (navigator.geolocation) {
      try {
        gpsData = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
              });
            },
            (error) => {
              console.warn('GPS unavailable:', error.message);
              resolve(null); // Continue without GPS
            },
            {
              timeout: 5000, // 5 second timeout
              maximumAge: 60000, // Accept cached position up to 1 minute old
              enableHighAccuracy: false // Faster, uses network location
            }
          );
        });
      } catch (error) {
        console.warn('GPS capture failed:', error);
      }
    }

    // Create an entry for each detail with count > 0
    for (const [detailId, count] of Object.entries(state.detailCounts)) {
      if (count > 0) {
        const unit = state.detailUnits[detailId] || '';
        await dataService.createEntryWithTimestamp({
          typeId: state.selectedType.id,
          detailId: parseInt(detailId),
          count: count,
          unit: unit,
          timestamp: timestamp,
          latitude: gpsData?.latitude,
          longitude: gpsData?.longitude,
          accuracy: gpsData?.accuracy
        });
      }
    }

    // Update config for last used (F-3.1)
    await dataService.setConfig('lastTypeId', state.selectedType.id);

    // Track last updated type and timestamp
    state.lastUpdatedTypeId = state.selectedType.id;
    state.typeLastUsed[state.selectedType.id] = timestamp;
    await dataService.setConfig(`lastUsed_type_${state.selectedType.id}`, timestamp);

    // Reset timestamp offset and clear glow
    state.timestampOffset = 0;
    document.querySelectorAll('.btn-clock-icon').forEach(btn => {
      btn.classList.remove('glowing');
    });

    // Return to main screen
    resetLogPage();

  } catch (error) {
    console.error('Failed to log entries:', error);
    alert('Failed to log entries: ' + error.message);
  }
}

// ============================================================================
// Add Detail Dialog
// ============================================================================

function showAddDetailDialog() {
  const dialog = document.getElementById('add-detail-dialog');
  const title = document.getElementById('dialog-title');

  // Update title with type name
  title.textContent = `Add New ${state.selectedType.name}`;

  // Clear previous inputs
  document.getElementById('dialog-detail-name').value = '';
  document.getElementById('dialog-detail-unit').value = '';
  document.getElementById('dialog-detail-icon').value = '';
  document.getElementById('dialog-detail-color').value = state.selectedType.color;

  // Show dialog
  dialog.classList.remove('hidden');
}

function hideAddDetailDialog() {
  const dialog = document.getElementById('add-detail-dialog');
  dialog.classList.add('hidden');
}

async function handleSaveNewDetail() {
  const name = document.getElementById('dialog-detail-name').value.trim();
  const unit = document.getElementById('dialog-detail-unit').value.trim();
  let charIcon = document.getElementById('dialog-detail-icon').value.trim();
  const color = document.getElementById('dialog-detail-color').value;

  // Validate required field
  if (!name) {
    alert('Please enter a name for the detail');
    return;
  }

  // Use a default icon if none provided
  if (!charIcon) {
    charIcon = '⭐';
  }

  try {
    // Create the new detail
    const newDetailId = await dataService.createDetail({
      typeId: state.selectedType.id,
      name: name,
      charIcon: charIcon,
      color: color,
      unit: unit
    });

    // Reload details for this type
    state.details = await dataService.getDetailsByType(state.selectedType.id);

    // Re-render the detail list
    renderDetailList();

    // Hide dialog
    hideAddDetailDialog();

    // Show success message
    alert(`${name} added successfully!`);

  } catch (error) {
    console.error('Failed to add detail:', error);
    alert('Failed to add detail: ' + error.message);
  }
}

// ============================================================================
// Type Management Dialogs
// ============================================================================

function showAddTypeDialog() {
  const dialog = document.getElementById('add-type-dialog');

  // Clear inputs
  document.getElementById('new-type-name').value = '';
  document.getElementById('new-type-icon').value = '';
  document.getElementById('new-type-color').value = '#3498db';

  dialog.classList.remove('hidden');
}

function hideAddTypeDialog() {
  const dialog = document.getElementById('add-type-dialog');
  dialog.classList.add('hidden');
}

async function handleSaveNewType() {
  const name = document.getElementById('new-type-name').value.trim();
  let charIcon = document.getElementById('new-type-icon').value.trim();
  const color = document.getElementById('new-type-color').value;

  if (!name) {
    alert('Please enter a name for the type');
    return;
  }

  // Use default icon if none provided
  if (!charIcon) {
    charIcon = '📋';
  }

  try {
    await dataService.createType({
      name: name,
      charIcon: charIcon,
      color: color
    });

    // Reload types
    await loadTypes();
    renderTypeTiles();

    hideAddTypeDialog();
    alert(`Type "${name}" created successfully!`);

  } catch (error) {
    console.error('Failed to add type:', error);
    alert('Failed to add type: ' + error.message);
  }
}

async function showDeleteTypeDialog() {
  const dialog = document.getElementById('delete-type-dialog');
  const select = document.getElementById('select-type-to-delete');

  // Clear and populate select
  select.innerHTML = '<option value="">Choose a type...</option>';
  state.types.forEach(type => {
    const option = document.createElement('option');
    option.value = type.id;
    option.textContent = `${type.charIcon} ${type.name}`;
    select.appendChild(option);
  });

  // Hide details section initially
  document.getElementById('delete-type-details').classList.add('hidden');
  document.getElementById('btn-delete-type-confirm').disabled = true;

  dialog.classList.remove('hidden');
}

function hideDeleteTypeDialog() {
  const dialog = document.getElementById('delete-type-dialog');
  dialog.classList.add('hidden');
}

async function handleTypeSelectionForDelete(e) {
  const typeId = parseInt(e.target.value);

  if (!typeId) {
    document.getElementById('delete-type-details').classList.add('hidden');
    document.getElementById('btn-delete-type-confirm').disabled = true;
    return;
  }

  // Get details for this type
  const details = await dataService.getDetailsByType(typeId);

  // Show details section
  document.getElementById('delete-type-details').classList.remove('hidden');
  document.getElementById('detail-count').textContent = details.length;

  // Populate reassign select (all types except the one being deleted)
  const reassignSelect = document.getElementById('reassign-type-select');
  reassignSelect.innerHTML = '<option value="">Do not reassign (details will be deleted)</option>';

  state.types.forEach(type => {
    if (type.id !== typeId) {
      const option = document.createElement('option');
      option.value = type.id;
      option.textContent = `${type.charIcon} ${type.name}`;
      reassignSelect.appendChild(option);
    }
  });

  // Reset checkbox
  document.getElementById('delete-details-checkbox').checked = false;

  // Enable confirm button
  document.getElementById('btn-delete-type-confirm').disabled = false;
}

function handleDeleteDetailsCheckboxChange(e) {
  const reassignSection = document.getElementById('reassign-section');

  if (e.target.checked) {
    // If deleting details, hide reassign option
    reassignSection.style.display = 'none';
  } else {
    reassignSection.style.display = 'block';
  }
}

async function handleConfirmDeleteType() {
  const typeId = parseInt(document.getElementById('select-type-to-delete').value);
  const deleteDetails = document.getElementById('delete-details-checkbox').checked;
  const reassignTypeId = parseInt(document.getElementById('reassign-type-select').value) || null;

  if (!typeId) return;

  const type = state.types.find(t => t.id === typeId);
  const details = await dataService.getDetailsByType(typeId);

  let confirmMessage = `Are you sure you want to delete the type "${type.name}"?\n\n`;

  if (deleteDetails) {
    confirmMessage += `⚠️ This will also DELETE ALL ${details.length} detail items and their logged entries (history)!\n\n`;
    confirmMessage += `This action CANNOT be undone!`;
  } else if (reassignTypeId) {
    const targetType = state.types.find(t => t.id === reassignTypeId);
    confirmMessage += `The ${details.length} detail items will be reassigned to "${targetType.name}".`;
  } else {
    confirmMessage += `The ${details.length} detail items will remain orphaned (you'll need to reassign them manually later).`;
  }

  if (!confirm(confirmMessage)) {
    return;
  }

  try {
    if (deleteDetails) {
      // Delete all details and their entries
      for (const detail of details) {
        await dataService.deleteDetail(detail.id);
      }
    } else if (reassignTypeId) {
      // Reassign details to another type
      for (const detail of details) {
        await dataService.updateDetail(detail.id, { typeId: reassignTypeId });
      }
    }

    // Delete the type
    await dataService.deleteType(typeId);

    // Reload types
    await loadTypes();
    renderTypeTiles();

    hideDeleteTypeDialog();
    alert(`Type "${type.name}" deleted successfully!`);

  } catch (error) {
    console.error('Failed to delete type:', error);
    alert('Failed to delete type: ' + error.message);
  }
}

// ============================================================================
// Move Details Dialog
// ============================================================================

function showMoveDetailsDialog() {
  if (state.checkedDetails.size === 0) return;

  const dialog = document.getElementById('move-details-dialog');
  const countEl = document.getElementById('move-details-count');
  const select = document.getElementById('select-target-type');
  const confirmBtn = document.getElementById('btn-move-confirm');

  // Show count
  const detailNames = Array.from(state.checkedDetails)
    .map(id => state.details.find(d => d.id === id)?.name)
    .filter(n => n)
    .join(', ');

  countEl.textContent = `Moving ${state.checkedDetails.size} detail(s): ${detailNames}`;

  // Populate type select (exclude current type)
  select.innerHTML = '<option value="">Choose a type...</option>';
  state.types
    .filter(t => t.id !== state.selectedType.id)
    .forEach(type => {
      const option = document.createElement('option');
      option.value = type.id;
      option.textContent = `${type.charIcon} ${type.name}`;
      select.appendChild(option);
    });

  confirmBtn.disabled = true;
  dialog.classList.remove('hidden');
}

function hideMoveDetailsDialog() {
  const dialog = document.getElementById('move-details-dialog');
  dialog.classList.add('hidden');
  document.getElementById('select-target-type').value = '';
}

function handleTargetTypeSelection() {
  const select = document.getElementById('select-target-type');
  const confirmBtn = document.getElementById('btn-move-confirm');
  confirmBtn.disabled = !select.value;
}

async function handleConfirmMoveDetails() {
  const targetTypeId = parseInt(document.getElementById('select-target-type').value);
  if (!targetTypeId || state.checkedDetails.size === 0) return;

  try {
    // Update each checked detail to new type
    for (const detailId of state.checkedDetails) {
      await dataService.updateDetail(detailId, { typeId: targetTypeId });
    }

    // Clear checked items
    state.checkedDetails.clear();

    // Hide dialog
    hideMoveDetailsDialog();

    // Refresh details list for current type
    state.details = await dataService.getDetailsByType(state.selectedType.id);
    renderDetailList();

    alert(`Details moved successfully to new type!`);
  } catch (error) {
    console.error('Failed to move details:', error);
    alert('Failed to move details. Please try again.');
  }
}

// ============================================================================
// Edit Detail Icon/Color Dialog
// ============================================================================

function showEditDetailDialog(detail) {
  state.editingDetail = detail;

  const dialog = document.getElementById('edit-detail-dialog');
  document.getElementById('edit-detail-name-display').value = detail.name;
  document.getElementById('edit-detail-icon').value = detail.charIcon;
  document.getElementById('edit-detail-color').value = detail.color;

  updateEditDetailPreview();
  dialog.classList.remove('hidden');
}

function hideEditDetailDialog() {
  const dialog = document.getElementById('edit-detail-dialog');
  dialog.classList.add('hidden');
  state.editingDetail = null;
}

function updateEditDetailPreview() {
  const icon = document.getElementById('edit-detail-icon').value || '😊';
  const color = document.getElementById('edit-detail-color').value;
  const preview = document.getElementById('edit-detail-preview');

  preview.textContent = icon;
  preview.style.color = color;
}

async function handleSaveEditDetail() {
  if (!state.editingDetail) return;

  const icon = document.getElementById('edit-detail-icon').value.trim();
  const color = document.getElementById('edit-detail-color').value;

  if (!icon) {
    alert('Please enter an icon');
    return;
  }

  try {
    // Update detail in database
    await dataService.updateDetail(state.editingDetail.id, {
      charIcon: icon,
      color: color
    });

    // Update local state
    const detail = state.details.find(d => d.id === state.editingDetail.id);
    if (detail) {
      detail.charIcon = icon;
      detail.color = color;
    }

    // Hide dialog
    hideEditDetailDialog();

    // Re-render details to show changes
    renderDetailList();

    alert('Detail appearance updated successfully!');
  } catch (error) {
    console.error('Failed to update detail:', error);
    alert('Failed to update detail. Please try again.');
  }
}

// ============================================================================
// Timestamp Adjustment Dialog
// ============================================================================

function showTimestampDialog(detailId) {
  state.timestampAdjustDetailId = detailId;
  state.timestampOffset = 0; // Reset to now
  state.timestampSign = -1; // Default to subtract

  const dialog = document.getElementById('timestamp-dialog');

  // Reset sign button
  const signBtn = document.getElementById('btn-timestamp-sign');
  signBtn.dataset.sign = '-1';
  signBtn.innerHTML = '<span class="sign-icon">−</span> Subtract';

  updateTimestampPreview();
  dialog.classList.remove('hidden');
}

function hideTimestampDialog() {
  const dialog = document.getElementById('timestamp-dialog');
  dialog.classList.add('hidden');
  state.timestampAdjustDetailId = null;
  state.timestampOffset = 0;
  state.timestampSign = -1;
}

function toggleTimestampSign() {
  state.timestampSign = state.timestampSign === -1 ? 1 : -1;

  const signBtn = document.getElementById('btn-timestamp-sign');
  signBtn.dataset.sign = state.timestampSign.toString();

  if (state.timestampSign === 1) {
    signBtn.innerHTML = '<span class="sign-icon">+</span> Add';
  } else {
    signBtn.innerHTML = '<span class="sign-icon">−</span> Subtract';
  }

  updateTimestampPreview();
}

function addTimestampIncrement(value) {
  // Apply increment with current sign (incremental on multiple clicks)
  state.timestampOffset += (value * state.timestampSign);
  updateTimestampPreview();
}

function resetTimestampToNow() {
  state.timestampOffset = 0;
  state.timestampSign = -1;

  const signBtn = document.getElementById('btn-timestamp-sign');
  signBtn.dataset.sign = '-1';
  signBtn.innerHTML = '<span class="sign-icon">−</span> Subtract';

  updateTimestampPreview();
}

function updateTimestampPreview() {
  const preview = document.getElementById('timestamp-preview');
  const adjustedTime = new Date(Date.now() + state.timestampOffset);

  const timeStr = adjustedTime.toLocaleString();
  const offsetStr = formatOffset(state.timestampOffset);

  if (state.timestampOffset === 0) {
    preview.innerHTML = `<div>Timestamp: <strong>${timeStr}</strong> (Now)</div>`;
  } else {
    preview.innerHTML = `<div>Timestamp: <strong>${timeStr}</strong> (${offsetStr})</div>`;
  }
}

function formatOffset(ms) {
  const absMs = Math.abs(ms);
  const sign = ms >= 0 ? '+' : '-';

  const minutes = Math.floor(absMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${sign}${days} day${days !== 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${sign}${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `${sign}${minutes} min`;
  } else {
    return 'Now';
  }
}

function applyTimestampOffset() {
  // F-2.1.1 Extension: If counter is 0 or undefined, set it to 1
  const detailId = state.timestampAdjustDetailId;
  if (detailId && (!state.detailCounts[detailId] || state.detailCounts[detailId] === 0)) {
    state.detailCounts[detailId] = 1;
    updateDetailCount(detailId);
    updateCommitButton();
  }

  // The offset is already stored in state.timestampOffset
  // It will be applied when committing entries
  hideTimestampDialog();

  // Visual feedback: Add glowing effect to all clock buttons
  document.querySelectorAll('.btn-clock-icon').forEach(btn => {
    if (state.timestampOffset !== 0) {
      btn.classList.add('glowing');
    } else {
      btn.classList.remove('glowing');
    }
  });
}

// ============================================================================
// Config Mode Functions
// ============================================================================

function enterConfigMode() {
  state.configMode = true;
  state.markedForDeletion.clear(); // Clear any previous marks
  renderDetailList();
}

function exitConfigMode() {
  state.configMode = false;
  state.detailUnitChanges = {}; // Clear any unsaved unit changes
  state.markedForDeletion.clear(); // Clear deletion marks
  state.checkedDetails.clear(); // Clear checked items
  renderDetailList();
}

function updateConfigModeButtons() {
  const moveBtn = document.getElementById('btn-move-details');
  const deleteBtn = document.getElementById('btn-delete-checked');

  if (moveBtn) {
    moveBtn.disabled = state.checkedDetails.size === 0;
  }
  if (deleteBtn) {
    deleteBtn.disabled = state.checkedDetails.size === 0;
  }
}

async function confirmDeleteCheckedDetails() {
  if (state.checkedDetails.size === 0) return;

  const checkedDetailsList = state.details.filter(d => state.checkedDetails.has(d.id));
  const detailNames = checkedDetailsList.map(d => `• ${d.name}`).join('\n');

  const confirmMessage = `⚠️ WARNING: The following items will be DELETED:\n\n${detailNames}\n\n` +
    `This will also DELETE ALL LOGGED ENTRIES (history) for these items.\n\n` +
    `This action CANNOT be undone!\n\n` +
    `Do you want to proceed?`;

  if (!confirm(confirmMessage)) {
    return; // User canceled
  }

  try {
    // Delete checked items
    for (const detailId of state.checkedDetails) {
      await dataService.deleteDetail(detailId);
    }

    // Clear checked items
    state.checkedDetails.clear();

    // Refresh details list
    state.details = await dataService.getDetailsByType(state.selectedType.id);
    renderDetailList();

    alert('Details deleted successfully!');
  } catch (error) {
    console.error('Failed to delete details:', error);
    alert('Failed to delete details. Please try again.');
  }
}

async function handleStoreConfig() {
  try {
    // Check if there are items marked for deletion
    if (state.markedForDeletion.size > 0) {
      const markedDetails = state.details.filter(d => state.markedForDeletion.has(d.id));
      const detailNames = markedDetails.map(d => `• ${d.name}`).join('\n');

      const confirmMessage = `⚠️ WARNING: The following items will be DELETED:\n\n${detailNames}\n\n` +
        `This will also DELETE ALL LOGGED ENTRIES (history) for these items.\n\n` +
        `This action CANNOT be undone!\n\n` +
        `Do you want to proceed?`;

      if (!confirm(confirmMessage)) {
        return; // User canceled
      }

      // Delete marked items
      for (const detailId of state.markedForDeletion) {
        await dataService.deleteDetail(detailId);
      }

      // Reload details for this type
      state.details = await dataService.getDetailsByType(state.selectedType.id);

      // Clear deletion marks
      state.markedForDeletion.clear();
    }

    // Get the current order from the DOM
    const detailRows = document.querySelectorAll('.detail-row:not(.marked-for-deletion)');
    const newOrder = [];

    detailRows.forEach((row, index) => {
      const detailId = parseInt(row.dataset.detailId);
      if (detailId && !state.markedForDeletion.has(detailId)) {
        newOrder.push(detailId);
      }
    });

    // Save unit changes if any
    if (state.detailUnitChanges) {
      for (const [detailId, newUnit] of Object.entries(state.detailUnitChanges)) {
        const id = parseInt(detailId);

        // Skip if marked for deletion
        if (state.markedForDeletion.has(id)) continue;

        await dataService.updateDetail(id, { unit: newUnit });

        // Update in state.details
        const detail = state.details.find(d => d.id === id);
        if (detail) {
          detail.unit = newUnit;
        }
      }
      // Clear unit changes
      state.detailUnitChanges = {};
    }

    // Save the order to config
    await dataService.setConfig(`detailOrder_type_${state.selectedType.id}`, newOrder);

    // Update state.details to match the new order
    const detailsById = {};
    state.details.forEach(d => {
      detailsById[d.id] = d;
    });

    state.details = newOrder.map(id => detailsById[id]).filter(d => d);

    // Exit config mode
    exitConfigMode();

    alert('Configuration saved!');

  } catch (error) {
    console.error('Failed to store config:', error);
    alert('Failed to save configuration: ' + error.message);
  }
}


// ============================================================================
// View Page (F-4.x - Data Review & Visualization)
// ============================================================================

function setupViewPage() {
  // Aggregation level toggle - apply instantly
  document.querySelectorAll('input[name="agg-level"]').forEach(radio => {
    radio.addEventListener('change', () => {
      toggleAggregationLevel();
      applyFilters();
    });
  });

  // Chart type change - apply instantly
  document.getElementById('chart-type').addEventListener('change', applyFilters);

  // Timespan changes - apply instantly
  document.getElementById('filter-timespan-unit').addEventListener('change', applyFilters);
  document.getElementById('filter-timespan-value').addEventListener('input', applyFilters);

  // Auto step size toggle - apply instantly
  document.getElementById('auto-step-size').addEventListener('change', (e) => {
    document.getElementById('manual-step-group').style.display = e.target.checked ? 'none' : 'block';
    applyFilters();
  });

  // Manual step size change - apply instantly
  document.getElementById('manual-step-size').addEventListener('change', applyFilters);

  // Axis toggle button
  document.getElementById('btn-axis-toggle').addEventListener('click', toggleAxisMode);

  // Select/Deselect all details buttons
  document.getElementById('btn-select-all-details').addEventListener('click', () => {
    document.querySelectorAll('#filter-details input[type="checkbox"]').forEach(cb => cb.checked = true);
    applyFilters();
  });

  document.getElementById('btn-deselect-all-details').addEventListener('click', () => {
    document.querySelectorAll('#filter-details input[type="checkbox"]').forEach(cb => cb.checked = false);
    applyFilters();
  });

  // Load saved view preferences from localStorage
  loadViewPreferences();
}

function toggleAxisMode() {
  const btn = document.getElementById('btn-axis-toggle');
  const currentAxis = btn.getAttribute('data-axis');

  if (currentAxis === 'y') {
    btn.setAttribute('data-axis', 'x');
    btn.textContent = 'X-Axis (Item-based)';
  } else {
    btn.setAttribute('data-axis', 'y');
    btn.textContent = 'Y-Axis (Time-based)';
  }

  // Apply changes immediately
  applyFilters();
}

function toggleAggregationLevel() {
  const aggLevel = document.querySelector('input[name="agg-level"]:checked').value;
  const typesGroup = document.getElementById('filter-types-group');
  const detailsGroup = document.getElementById('filter-details-group');

  if (aggLevel === 'type') {
    typesGroup.style.display = 'block';
    detailsGroup.style.display = 'none';
  } else {
    typesGroup.style.display = 'none';
    detailsGroup.style.display = 'block';
  }
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
    checkbox.addEventListener('change', applyFilters); // Apply instantly

    const label = document.createElement('label');
    label.htmlFor = `filter-type-${type.id}`;
    label.textContent = type.name;
    label.style.color = type.color;

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    filterContainer.appendChild(wrapper);
  });

  // Populate detail filter checkboxes
  await populateDetailFilters();

  // Apply initial filters
  await applyFilters();
}

async function populateDetailFilters() {
  const filterContainer = document.getElementById('filter-details');
  filterContainer.innerHTML = '';

  // Get all details from all types
  const allDetails = await dataService.getDetails();

  // Group by type for better organization
  const detailsByType = {};
  allDetails.forEach(detail => {
    if (!detailsByType[detail.typeId]) {
      detailsByType[detail.typeId] = [];
    }
    detailsByType[detail.typeId].push(detail);
  });

  // Render grouped by type
  state.types.forEach(type => {
    const details = detailsByType[type.id] || [];
    if (details.length === 0) return;

    // Type header
    const typeHeader = document.createElement('div');
    typeHeader.style.cssText = 'font-weight: bold; margin-top: 10px; margin-bottom: 5px; color: ' + type.color;
    typeHeader.textContent = type.name;
    filterContainer.appendChild(typeHeader);

    // Details for this type
    details.forEach(detail => {
      const wrapper = document.createElement('div');
      wrapper.className = 'filter-checkbox';
      wrapper.style.marginLeft = '15px';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `filter-detail-${detail.id}`;
      checkbox.value = detail.id;
      checkbox.checked = false; // Start with none selected
      checkbox.addEventListener('change', applyFilters); // Apply instantly

      const label = document.createElement('label');
      label.htmlFor = `filter-detail-${detail.id}`;
      label.textContent = `${detail.charIcon} ${detail.name}`;
      label.style.color = detail.color;

      wrapper.appendChild(checkbox);
      wrapper.appendChild(label);
      filterContainer.appendChild(wrapper);
    });
  });
}

async function applyFilters() {
  try {
    const aggLevel = document.querySelector('input[name="agg-level"]:checked').value;

    // Get selected IDs based on aggregation level
    let typeIds = [];
    let detailIds = [];

    if (aggLevel === 'type') {
      const typeCheckboxes = document.querySelectorAll('#filter-types input[type="checkbox"]:checked');
      typeIds = Array.from(typeCheckboxes).map(cb => parseInt(cb.value));
    } else {
      const detailCheckboxes = document.querySelectorAll('#filter-details input[type="checkbox"]:checked');
      detailIds = Array.from(detailCheckboxes).map(cb => parseInt(cb.value));

      // If no details selected, show message and return
      if (detailIds.length === 0) {
        const svg = document.getElementById('chart-svg');
        svg.innerHTML = '<text x="50%" y="50%" text-anchor="middle" fill="#95a5a6">Please select at least one detail to display</text>';
        document.getElementById('entries-container').innerHTML = '<p style="color: #95a5a6;">No details selected</p>';
        return;
      }
    }

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
      typeIds: typeIds.length > 0 ? typeIds : undefined,
      startTime: startTime.toISOString(),
      endTime: now.toISOString()
    });

    // Filter by detail IDs if detail aggregation selected
    let filteredEntries = entries;
    if (aggLevel === 'detail' && detailIds.length > 0) {
      filteredEntries = entries.filter(entry => detailIds.includes(entry.detailId));
    }

    // Render chart
    await renderChart(filteredEntries, aggLevel, aggLevel === 'type' ? typeIds : detailIds, startTime, now);

    // Render entries list
    renderEntriesList(filteredEntries);

  } catch (error) {
    console.error('Failed to apply filters:', error);
    alert('Failed to load data: ' + error.message);
  }
}

async function renderChart(entries, aggLevel, selectedIds, startTime, endTime) {
  const chartType = document.getElementById('chart-type').value;
  const svg = document.getElementById('chart-svg');

  // Get axis mode (Y or X)
  const axisMode = document.getElementById('btn-axis-toggle').getAttribute('data-axis');

  // Save preferences
  saveViewPreferences();

  let chartData;

  if (axisMode === 'y') {
    // Y-AXIS MODE: Time-based aggregation (counter on Y-axis)
    // Time labels on X-axis, aggregated data on Y-axis

    const autoStepSize = document.getElementById('auto-step-size').checked;
    const timespanValue = parseInt(document.getElementById('filter-timespan-value').value);
    const timespanUnit = document.getElementById('filter-timespan-unit').value;

    let stepSize;
    if (autoStepSize) {
      stepSize = calculateAutoStepSize(timespanValue, timespanUnit);
    } else {
      stepSize = document.getElementById('manual-step-size').value;
    }

    // Aggregate by time steps
    chartData = await aggregateByTimeSteps(
      entries,
      startTime,
      endTime,
      stepSize,
      aggLevel,
      selectedIds,
      state.types,
      dataService.getDetail
    );

  } else {
    // X-AXIS MODE: Item-based aggregation (counter on X-axis)
    // Item names on Y-axis, total counts on X-axis (NO TIME)

    chartData = await aggregateByItems(entries, aggLevel, selectedIds, state.types, dataService.getDetail);
  }

  // If no data, show message
  if (!chartData || chartData.length === 0) {
    svg.innerHTML = '<text x="50%" y="50%" text-anchor="middle" fill="#95a5a6">No data available for the selected filters</text>';
    return;
  }

  // Render based on chart type and axis mode
  const options = { axisMode };

  switch (chartType) {
    case 'bar':
      if (axisMode === 'y') {
        // Y-axis mode: vertical bars with time on X-axis
        renderGroupedBarChart(svg, chartData, options);
      } else {
        // X-axis mode: horizontal bars with items on Y-axis
        renderHorizontalBarChart(svg, chartData, options);
      }
      break;
    case 'line':
      if (axisMode === 'y') {
        renderMultiLineChart(svg, chartData, options);
      } else {
        // Line chart doesn't make sense without time dimension
        svg.innerHTML = '<text x="50%" y="50%" text-anchor="middle" fill="#95a5a6">Line chart requires Y-axis (time-based) mode</text>';
      }
      break;
    case 'pie':
      // For pie chart, aggregate all data
      const pieData = {};
      chartData.forEach(step => {
        step.items.forEach(item => {
          if (!pieData[item.name]) {
            pieData[item.name] = { label: item.name, value: 0, color: item.color };
          }
          pieData[item.name].value += item.value;
        });
      });
      renderPieChart(svg, Object.values(pieData));
      break;
  }
}

/**
 * Aggregate entries by items (no time dimension)
 * Used for X-axis mode where counter is on X-axis
 */
async function aggregateByItems(entries, aggLevel, selectedIds, types, getDetailFn) {
  const items = {};

  if (aggLevel === 'type') {
    // Aggregate by type
    for (const entry of entries) {
      if (!items[entry.typeId]) {
        const type = types.find(t => t.id === entry.typeId);
        items[entry.typeId] = {
          name: type?.name || 'Unknown',
          value: 0,
          color: type?.color || '#95a5a6'
        };
      }
      items[entry.typeId].value += entry.count;
    }
  } else {
    // Aggregate by detail
    for (const entry of entries) {
      if (!items[entry.detailId]) {
        const detail = await getDetailFn(entry.detailId);
        items[entry.detailId] = {
          name: detail?.name || 'Unknown',
          value: 0,
          color: detail?.color || '#95a5a6'
        };
      }
      items[entry.detailId].value += entry.count;
    }
  }

  // Return in same format as time-aggregated data for consistent rendering
  return [{
    label: 'Total',
    items: Object.values(items)
  }];
}

function saveViewPreferences() {
  const prefs = {
    chartType: document.getElementById('chart-type').value,
    autoStepSize: document.getElementById('auto-step-size').checked,
    manualStepSize: document.getElementById('manual-step-size').value,
    axisMode: document.getElementById('btn-axis-toggle').getAttribute('data-axis'),
    aggLevel: document.querySelector('input[name="agg-level"]:checked').value,
    timespanUnit: document.getElementById('filter-timespan-unit').value,
    timespanValue: document.getElementById('filter-timespan-value').value
  };
  localStorage.setItem('llogg-view-prefs', JSON.stringify(prefs));
}

function loadViewPreferences() {
  const saved = localStorage.getItem('llogg-view-prefs');
  if (!saved) return;

  try {
    const prefs = JSON.parse(saved);
    if (prefs.chartType) document.getElementById('chart-type').value = prefs.chartType;
    if (prefs.autoStepSize !== undefined) document.getElementById('auto-step-size').checked = prefs.autoStepSize;
    if (prefs.manualStepSize) document.getElementById('manual-step-size').value = prefs.manualStepSize;

    // Load axis mode
    const axisBtn = document.getElementById('btn-axis-toggle');
    if (prefs.axisMode) {
      axisBtn.setAttribute('data-axis', prefs.axisMode);
      if (prefs.axisMode === 'x') {
        axisBtn.textContent = 'X-Axis (Item-based)';
      } else {
        axisBtn.textContent = 'Y-Axis (Time-based)';
      }
    }

    if (prefs.aggLevel) {
      const radio = document.querySelector(`input[name="agg-level"][value="${prefs.aggLevel}"]`);
      if (radio) radio.checked = true;
    }
    if (prefs.timespanUnit) document.getElementById('filter-timespan-unit').value = prefs.timespanUnit;
    if (prefs.timespanValue) document.getElementById('filter-timespan-value').value = prefs.timespanValue;

    // Update UI
    document.getElementById('manual-step-group').style.display = prefs.autoStepSize ? 'none' : 'block';
    toggleAggregationLevel();
  } catch (e) {
    console.error('Failed to load view preferences:', e);
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

  // Export Config
  document.getElementById('btn-export-config').addEventListener('click', handleExportConfig);

  // Import Config
  document.getElementById('btn-import-config').addEventListener('click', () => {
    document.getElementById('input-import-config').click();
  });

  document.getElementById('input-import-config').addEventListener('change', handleImportConfig);

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

async function handleExportConfig() {
  try {
    const config = await exportConfig();
    const filename = `life-logger-config-${new Date().toISOString().split('T')[0]}.txt`;
    downloadConfig(config, filename);
    alert('Configuration exported successfully!');
  } catch (error) {
    console.error('Export config failed:', error);
    alert('Failed to export configuration: ' + error.message);
  }
}

async function handleImportConfig(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const content = await file.text();
    const result = await importConfig(content);

    let message = 'Configuration import completed!\n\n';
    message += `Types created: ${result.importedTypes}\n`;
    message += `Types updated: ${result.updatedTypes}\n`;
    message += `Details created: ${result.importedDetails}\n`;
    message += `Details updated: ${result.updatedDetails}\n`;

    if (result.errors.length > 0) {
      message += `\nErrors: ${result.errors.length}`;
    }

    alert(message);

    if (result.errors.length > 0) {
      console.log('Import errors:', result.errors);
    }

    // Reload data and UI
    await loadTypes();
    renderTypeTiles();

  } catch (error) {
    console.error('Import config failed:', error);
    alert('Failed to import configuration: ' + error.message);
  }

  // Reset the file input
  event.target.value = '';
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
