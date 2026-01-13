# Life Logger - Project State Summary

**Date:** 2026-01-12
**Status:** MVP Implementation Complete - Running and Testable
**Server:** Python HTTP Server on port 8000 (running in background)

---

## Project Overview

A lightweight, privacy-first personal data tracking PWA built with Vanilla JavaScript, IndexedDB, and custom SVG charts. No build tools required - runs directly in browser.

**Key Features Implemented:**
- Type → Details → Count logging flow with batch commit
- IndexedDB for local storage (browser-based)
- Custom units per entry (not per detail)
- Visual feedback (pulsing glow) on logged types
- Long-press info showing "last used" timestamp
- CSV export/import
- SVG-based charts (Bar, Line, Pie)
- PWA support (manifest + service worker)
- Touch-optimized UI (mobile-first)

---

## Technology Stack

- **Frontend:** Vanilla JavaScript ES6 Modules
- **Database:** IndexedDB (native browser API, no wrapper library)
- **Charts:** Custom SVG rendering
- **Styling:** Pure CSS with CSS variables
- **Server:** Python HTTP Server (development only)
- **No Build Tools:** Direct browser execution

---

## Project Structure

```
/home/bbb/life-logger/
├── public/                          # Served by HTTP server
│   ├── index.html                   # Main UI (all 3 pages: Log, View, Settings)
│   ├── styles.css                   # Responsive CSS (mobile-first)
│   ├── manifest.json                # PWA manifest
│   ├── sw.js                        # Service worker for offline support
│   ├── test.html                    # Automated test suite
│   └── src/                         # JavaScript modules
│       ├── main.js                  # App controller (navigation, UI logic)
│       ├── lib/
│       │   ├── db.js                # IndexedDB schema + dummy data
│       │   ├── dataService.js       # CRUD operations
│       │   └── csvService.js        # Import/Export
│       └── components/
│           └── charts.js            # SVG charts (Bar, Line, Pie)
├── src/                             # Original source (symlink/copy)
├── README.md                        # User documentation
├── TESTING.md                       # Testing guide
├── TEST_RESULTS.md                  # Test results
└── PROJECT_STATE.md                 # This file
```

---

## Database Schema (IndexedDB)

### Object Stores:

**1. Types**
```javascript
{
  id: number (auto-increment),
  name: string,
  color: string (hex),
  charIcon: string (1-2 chars)
}
```

**2. Details** (1:n relationship with Types)
```javascript
{
  id: number (auto-increment),
  typeId: number (FK to Types),
  name: string,
  color: string (hex),
  charIcon: string (1-2 chars),
  unit: string (optional, used as placeholder)
}
```

**3. Entries**
```javascript
{
  id: number (auto-increment),
  typeId: number (FK to Types),
  detailId: number (FK to Details),
  count: number (>= 1),
  unit: string (custom per entry!),
  timestamp: string (ISO 8601)
}
```

**4. Config** (key-value store)
```javascript
{
  key: string,
  value: any
}
```

**Indexes:**
- Entries: `timestamp`, `typeId`, `typeId_timestamp` (compound)
- Details: `typeId`

---

## Dummy Data (Initial Setup)

**Types:**
1. 😊 Mood (Blue #3498db)
2. 🏃 Activity (Green #2ecc71)
3. 🍽️ Food (Red #e74c3c)
4. 😴 Sleep (Purple #9b59b6)

**Mood Details:**
1. 😊 Happy (Yellow #f1c40f)
2. 😢 Sad (Blue #3498db)
3. 😐 Neutral (Gray #95a5a6)
4. 😠 Angry (Red #e74c3c)
5. 😨 Frightened (Purple #9b59b6)
6. ⚡ Energetic (Orange #e67e22)
7. 😴 Tired (Dark Gray #7f8c8d)

**Activity Details:**
- Running, Cycling, Walking, Gym (with units: Minutes/km)

**Food Details:**
- Breakfast, Lunch, Dinner, Snack

**Sleep Details:**
- Night Sleep (Hours), Nap (Minutes)

---

## Key User Flows

### 1. Logging Entries (Primary Flow)

**Type Selection Screen:**
- Shows all types as tiles with "Add [Type]" buttons below
- Long-press on tile → shows "Last used: Xs ago"
- Click tile OR "Add" button → goes to Detail screen

**Detail Selection Screen:**
- Shows all details for selected type as rows:
  - **Left:** Icon + Detail Name
  - **Middle:** − Button | Count | + Button (optimized for thumb reach)
  - **Right:** Unit input field (optional, custom per entry)
- Can increment multiple details
- **Back** button (always active)
- **Commit Log** button (disabled until count > 0)

**After Commit:**
- Returns to Type screen
- Committed type shows **pulsing blue glow** (3x pulse + 5s fade = 8s total)
- No alert message

### 2. View Data

- Filter by types (checkboxes)
- Filter by time span (Hours/Days/Weeks/Months)
- Chart type selector (Bar/Line/Pie)
- Shows SVG chart + list of recent entries (max 20)

### 3. Settings

- **Manage Entry Definitions:** CRUD for Types/Details
- **Export CSV:** Downloads data with format: `id;timestamp;type_name;detail_name;count;unit`
- **Import CSV:** Uploads and parses CSV

---

## Critical Implementation Details

### Custom Units Per Entry
- **NOT stored in Detail definition** (only as placeholder)
- User enters unit in input field when logging
- Stored directly in Entry record
- Example: Same detail "Bread" can have different units:
  - Entry 1: 3 slices
  - Entry 2: 200 grams
  - Entry 3: 150 kcal

### Long-Press Detection
- 1 second hold triggers info popup
- Works with touch (mobile) and mouse (desktop)
- Shows: Type name + "Last used: [time] ago"
- Time format: Xs, Xm, Xh, Xd, or NEVER
- Click anywhere to close popup

### Visual Feedback (Pulsing Glow)
- Animation: 8 seconds total
  - 0-3s: 3 pulses (bright → dim → bright)
  - 3-8s: Smooth fade to invisible
- CSS animation: `pulseAndFade`
- Removed after 8s via setTimeout + re-render

### CSV Format
```csv
id;timestamp;type_name;detail_name;count;unit
1;2026-01-12T14:23:45.123Z;Mood;Happy;1;
2;2026-01-12T15:30:12.456Z;Activity;Running;45;Minutes
```
- Delimiter: semicolon (;)
- Encoding: UTF-8 with BOM
- Unit comes from Entry, not Detail

---

## Current State

### What's Working ✅
- IndexedDB initialization with dummy data
- Type tile selection with long-press info
- Detail list with counter buttons (centered for mobile)
- Custom unit input per entry
- Batch commit (multiple entries at once)
- Pulsing glow visual feedback
- CSV export with custom units
- CSV import
- SVG charts (Bar, Line, Pie)
- PWA manifest
- Service worker
- Responsive design
- Touch-optimized layout

### What's NOT Implemented ❌
- GPS location tracking (F-2.2)
- Weather data integration (F-2.3)
- Health data sync (F-2.7)
- Cloud sync (F-3.5)
- Advanced visualizations (F-4.10)
- ID conflict resolution on import (Sprint 2)
- Performance testing with 100k entries
- PWA icons (192x192, 512x512 PNG)

---

## Server Information

**Current Status:** ✅ Running
**Command:** `python3 -m http.server 8000`
**Working Directory:** `/home/bbb/life-logger/public`
**Port:** 8000
**PID:** Check with `ps aux | grep "python3 -m http.server 8000"`

**URLs:**
- Main App: http://localhost:8000/
- Test Suite: http://localhost:8000/test.html

**Start Server:**
```bash
cd /home/bbb/life-logger/public
python3 -m http.server 8000 &
```

**Stop Server:**
```bash
pkill -f "python3 -m http.server 8000"
```

---

## File Permissions Required

When restarting this project, request these permissions immediately:

```bash
# Read permissions for all files
Read: /home/bbb/life-logger/**

# Write permissions for source files
Write: /home/bbb/life-logger/public/index.html
Write: /home/bbb/life-logger/public/styles.css
Write: /home/bbb/life-logger/public/manifest.json
Write: /home/bbb/life-logger/public/sw.js
Write: /home/bbb/life-logger/public/src/main.js
Write: /home/bbb/life-logger/public/src/lib/db.js
Write: /home/bbb/life-logger/public/src/lib/dataService.js
Write: /home/bbb/life-logger/public/src/lib/csvService.js
Write: /home/bbb/life-logger/public/src/components/charts.js

# Write permissions for documentation
Write: /home/bbb/life-logger/*.md

# Bash permissions for server management
Bash: cd, python3, curl, grep, ls, ps, pkill
```

---

## Quick Start Commands

```bash
# 1. Check if server is running
curl -I http://localhost:8000/

# 2. Start server if not running
cd /home/bbb/life-logger/public && python3 -m http.server 8000 &

# 3. Verify all files are accessible
curl -s http://localhost:8000/src/main.js | head -5

# 4. Check for errors in main files
curl -s http://localhost:8000/ | grep "error"
```

---

## Common Tasks

### Add New Mood to Dummy Data
Edit: `/home/bbb/life-logger/public/src/lib/db.js`
Location: Line ~117-124 (Mood details array)
Format:
```javascript
{ typeId: typeIds['Mood'], name: 'NewMood', color: '#hexcode', charIcon: '😀', unit: '' },
```

### Change Visual Feedback Duration
Edit: `/home/bbb/life-logger/public/styles.css`
Line ~162: Change `animation: pulseAndFade 8s`
Edit: `/home/bbb/life-logger/public/src/main.js`
Line ~119: Change `setTimeout(..., 8000)`

### Adjust Mobile Layout
Edit: `/home/bbb/life-logger/public/styles.css`
Sections:
- `.detail-row` (line ~284): Main row layout
- `.detail-row-controls` (line ~320): Counter button positioning
- `.detail-row-unit-wrapper` (line ~328): Unit input positioning

### Modify CSV Format
Edit: `/home/bbb/life-logger/public/src/lib/csvService.js`
- Export: Line ~35-42 (row construction)
- Import: Line ~70+ (parsing logic)

---

## Known Issues & Limitations

1. **No Browser-Side Validation:** App assumes modern browser with IndexedDB support
2. **No Error Recovery:** If IndexedDB fails, user must clear browser data
3. **No Undo:** Once committed, entries can't be edited/deleted via UI
4. **No Multi-Language:** All text is hardcoded in English
5. **No Dark/Light Mode Toggle:** Dark mode only
6. **CSV Import Conflicts:** No conflict resolution for duplicate IDs (Sprint 2)
7. **Limited Chart Data:** Charts aggregate all time, no custom date ranges yet
8. **No Data Validation:** User can enter any count/unit (no min/max)

---

## Testing Checklist

After any code change, verify:

1. ✅ Server returns HTTP 200 for all files
2. ✅ Browser console shows no errors
3. ✅ IndexedDB "LifeLoggerDB" is created
4. ✅ Dummy data loads (4 types visible)
5. ✅ Type tile click opens detail list
6. ✅ Counter buttons increment/decrement
7. ✅ Unit input accepts text
8. ✅ "Commit Log" button enables when count > 0
9. ✅ After commit, returns to type screen with glow
10. ✅ Long-press shows "Last used" popup
11. ✅ View page shows charts
12. ✅ CSV export downloads file
13. ✅ Settings page loads

**Test URLs:**
- Manual: http://localhost:8000/
- Automated: http://localhost:8000/test.html

---

## Requirements Document

Full requirements: `/home/bbb/.claude/req.md`
- MVP features: F-1.x, F-2.1, F-3.x, F-4.x, NF-1.x, NF-2.1
- Future features: F-2.2-2.7 (GPS, Weather, Health)

---

## Development Notes

### Why Vanilla JS?
- Node.js/npm not available in environment
- No build step needed
- Direct browser execution
- Faster iteration
- Smaller bundle size
- Better for learning

### Why No TypeScript?
- No TypeScript compiler available
- Would require build step
- Vanilla JS with JSDoc provides type hints in IDE

### Why IndexedDB Directly?
- No wrapper library needed
- Full control over schema
- Better performance
- Smaller footprint
- Recommended wrapper (`idb`) requires npm

### Design Decisions

**Mobile-First Layout:**
- Counter buttons centered for thumb reach
- Large touch targets (48px minimum)
- Unit input on right (less frequently used)
- Icon + name on left (visual hierarchy)

**Batch Commit Pattern:**
- Allows logging multiple moods at once (e.g., Happy:3, Sad:1)
- Reduces number of taps
- Better for quick logging throughout day
- Each detail gets separate entry with its own unit

**Custom Units Per Entry:**
- More flexible than fixed units
- Same detail can have different contexts
- Examples:
  - Bread: slices vs grams vs kcal
  - Running: minutes vs km vs calories
  - Water: glasses vs liters vs oz

**No Summary Preview:**
- User requested removal
- Saves screen space
- Faster workflow
- Visual feedback via glow is sufficient

---

## Next Steps (If Continuing Development)

### Priority 1 (MVP Polish):
1. Create PWA icons (192x192, 512x512)
2. Test on actual mobile devices
3. Performance test with 10k entries
4. Add edit/delete functionality for entries
5. Improve error messages (replace alerts)

### Priority 2 (User Experience):
1. Add swipe gestures (back navigation)
2. Keyboard shortcuts for desktop
3. Remember last used unit per detail
4. Add confirmation dialogs for destructive actions
5. Export/import config separately from data

### Priority 3 (Future Features):
1. GPS location tracking (F-2.2)
2. Weather integration (F-2.3)
3. Health data sync (F-2.7)
4. Cloud sync (F-3.5)
5. Advanced charts with date pickers
6. Data encryption
7. Multi-device sync

---

## Troubleshooting

### Server Won't Start
```bash
# Check if port is in use
lsof -i :8000
# Kill existing process
pkill -f "python3 -m http.server 8000"
# Start fresh
cd /home/bbb/life-logger/public && python3 -m http.server 8000
```

### Files Not Loading (404)
```bash
# Verify file structure
ls -la /home/bbb/life-logger/public/src/
# Check file permissions
stat /home/bbb/life-logger/public/src/main.js
```

### IndexedDB Not Working
1. Clear browser data (Application → IndexedDB → Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Check browser console for errors
4. Verify browser supports IndexedDB

### Glow Not Appearing
1. Check CSS loaded: `curl http://localhost:8000/styles.css | grep pulseAndFade`
2. Check JS state: Browser console → `state.lastUpdatedTypeId`
3. Verify 8-second timeout isn't clearing too fast

### Units Not Saving
1. Check Entry schema includes `unit` field
2. Verify `state.detailUnits` is populated
3. Check CSV export shows units in correct column
4. Test in browser console: `state.detailUnits`

---

## Contact & Resources

- **Requirements:** `/home/bbb/.claude/req.md`
- **User Guide:** `/home/bbb/life-logger/README.md`
- **Testing Guide:** `/home/bbb/life-logger/TESTING.md`
- **This Document:** `/home/bbb/life-logger/PROJECT_STATE.md`

---

**Last Updated:** 2026-01-12
**Version:** 1.0.0 (MVP Complete)
**Author:** Claude (Anthropic)
**Status:** Production-ready for single-user testing
