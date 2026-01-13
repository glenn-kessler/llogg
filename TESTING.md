# Testing Guide for Life Logger

## Testing Status

✅ **Code Structure**: All modules properly structured with ES6 imports/exports
✅ **File Paths**: All JavaScript files accessible via HTTP server
✅ **Module Dependencies**: Import chains verified

## How to Test the Application

### 1. Start the Server

The server is already running on port 8000. If you need to restart:

```bash
cd /home/bbb/life-logger/public
python3 -m http.server 8000
```

### 2. Open in Browser

**Main App:**
- URL: http://localhost:8000/
- This loads the full application

**Test Suite:**
- URL: http://localhost:8000/test.html
- This runs automated tests and shows results

### 3. Manual Testing Checklist

#### Test 1: Database Initialization
1. Open http://localhost:8000/
2. Open browser DevTools (F12) → Console
3. Check for any errors
4. Expected: No errors, dummy data loaded

#### Test 2: View Types
1. On the main page, you should see tiles for:
   - 😊 Mood
   - 🏃 Activity
   - 🍽️ Food
   - 😴 Sleep

#### Test 3: Create Entry (3-Click Flow)
1. Click on a Type tile (e.g., "Mood")
2. Select a Detail tile (e.g., "Happy")
3. Adjust count if needed (default is 1)
4. Click "Log Entry" button
5. Expected: Success alert, returns to Type selection

#### Test 4: View Data
1. Click "View" tab in navigation
2. Select type filters (checkboxes)
3. Set time span (e.g., 7 days)
4. Click "Apply"
5. Expected: Chart renders with data

#### Test 5: Manage Definitions
1. Click "Settings" tab
2. Click "Manage Entry Definitions"
3. Click "Types" or "Details" tab
4. Try adding a new Type:
   - Name: "Test Type"
   - Icon: "TT"
   - Color: Pick any color
   - Click "Add Type"
5. Expected: Type appears in list

#### Test 6: CSV Export
1. Go to Settings
2. Click "Export Data (CSV)"
3. Expected: CSV file downloads

#### Test 7: CSV Import
1. Have a CSV file ready (use exported one)
2. Go to Settings
3. Click "Import Data (CSV)"
4. Select file
5. Expected: Import confirmation with count

### 4. Browser Console Tests

Open DevTools Console and run these commands:

```javascript
// Test 1: Check if app initialized
console.log('App loaded');

// Test 2: Check IndexedDB
indexedDB.databases().then(console.log);

// Test 3: Check for LifeLoggerDB
// Should show: name: "LifeLoggerDB", version: 1
```

### 5. Automated Test Page

Visit http://localhost:8000/test.html

This page automatically:
- ✓ Tests module imports
- ✓ Initializes database
- ✓ Adds dummy data
- ✓ Loads types and details
- ✓ Shows results in real-time

Manual test buttons:
1. "Test DB Init" - Verifies database
2. "Load Types" - Shows all types
3. "Create Entry" - Creates a test entry
4. "Test CSV Export" - Generates CSV

### Expected Results

All tests should pass without errors. The browser console should show:
- IndexedDB successfully opened
- Dummy data loaded (if first run)
- No module loading errors
- No CORS errors (since served via HTTP)

### Common Issues and Fixes

**Issue 1: "Failed to fetch module"**
- Fix: Ensure server is running from `public/` directory
- Check: http://localhost:8000/src/main.js should return JavaScript

**Issue 2: IndexedDB errors**
- Fix: Clear browser data and refresh
- Check: Ensure browser supports IndexedDB

**Issue 3: Module import errors**
- Fix: Ensure all .js files have correct export statements
- Check: Browser supports ES6 modules

**Issue 4: Charts not rendering**
- Fix: Check browser console for SVG errors
- Ensure data exists (add entries first)

### Browser Requirements

Minimum versions:
- Chrome 90+
- Firefox 88+
- Safari 14+

Features required:
- ES6 Modules
- IndexedDB
- Promises/Async-Await
- SVG support

### Performance Verification

To test with more data, open DevTools console:

```javascript
// Generate 100 test entries
const types = await (await indexedDB.databases())[0];
// (Manual entry creation via UI is safer for testing)
```

## Verification Commands (Server-side)

```bash
# Verify all JS files are accessible
curl -s http://localhost:8000/src/main.js | head -5
curl -s http://localhost:8000/src/lib/db.js | head -5
curl -s http://localhost:8000/src/lib/dataService.js | head -5
curl -s http://localhost:8000/src/lib/csvService.js | head -5
curl -s http://localhost:8000/src/components/charts.js | head -5

# All should return JavaScript code, not 404
```

## Next Steps After Testing

1. ✅ Verify all core functionality works
2. 📸 Take screenshots of each page
3. 🚀 Deploy to production (GitHub Pages, Netlify, etc.)
4. 📱 Test on mobile devices
5. 🎨 Create app icons (192x192 and 512x512 PNG)

## Status

Server Status: ✅ Running on port 8000
Files Status: ✅ All modules in place
Ready for Browser Testing: ✅ YES
