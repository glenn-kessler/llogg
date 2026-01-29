# Bug Report: Counter Pre-fill Persists After Detail Edit

## Bug Description
When editing a detail's appearance (icon/color) in config mode, the counters show pre-filled values (>0) instead of starting at 0. This happens because the pre-filled counter state persists after renderDetailList() is called.

## Steps to Reproduce
1. Open the llogg application
2. Go to "Log" tab
3. Select a type (e.g., "Mood") that has existing entries
4. **Observe**: Counters are pre-filled with last logged values (e.g., Happy=4, Sad=2)
5. Enable config mode (gear icon)
6. Click on a detail's icon to edit it (e.g., change Happy's icon)
7. Save the changes
8. **Bug**: The counters still show the pre-filled values (Happy=4, Sad=2)
9. **Expected**: Counters should be reset to 0 or not shown in config mode

## Root Cause Analysis

### Code Flow
1. `selectType()` (main.js:473) calls `await prefillDetailCounts(state.details)`
2. This populates `state.detailCounts` with last logged values
3. When user edits a detail, `handleSaveEditDetail()` (main.js:1226) is called
4. After saving, it calls `renderDetailList()` (main.js:1255)
5. **Problem**: `renderDetailList()` does NOT clear `state.detailCounts`
6. The counter values persist and are displayed even though we're just editing appearance

### Affected Code Locations
- `public/src/main.js:1255` - renderDetailList() after edit
- `public/src/main.js:240-251` - prefillDetailCounts() function
- `public/src/main.js:473` - selectType() calls prefillDetailCounts()

## Expected Behavior
When in config mode and editing detail appearance:
- Option A: Counters should not be displayed at all (since you're not logging)
- Option B: Counters should be reset to 0
- Option C: Only prefill counters when in logging mode (not config mode)

## Introduced In
- Commit: f1f6a00 "Implement counter pre-fill with last values (F-1.5.1)"
- Date: Wed Jan 21 18:21:11 2026
- The feature works correctly for normal logging workflow
- The bug appears only when editing details after counters have been pre-filled

## Workaround
Exit to type selection and re-select the type to start with clean counters.

## Suggested Fix
Add a check in config mode or reset counters when editing:

```javascript
// Option 1: In handleSaveEditDetail(), reset counts after rendering
async function handleSaveEditDetail() {
  // ... existing update code ...

  // Hide dialog
  hideEditDetailDialog();

  // Reset counters since we're just editing appearance
  resetDetailCounts();

  // Re-render details to show changes
  renderDetailList();

  alert('Detail appearance updated successfully!');
}
```

Or

```javascript
// Option 2: Don't prefill when in config mode
async function selectType(type) {
  // ... existing code ...

  // Pre-fill counts with last used values (only in logging mode)
  if (!state.configMode) {
    await prefillDetailCounts(state.details);
  } else {
    resetDetailCounts();
  }

  renderDetailList();
  showSection('detail');
}
```

## Testing Plan
1. Test with earlier version (before f1f6a00) to confirm bug doesn't exist
2. Apply fix
3. Verify counters behave correctly in both logging and config modes
4. Ensure pre-fill feature still works in normal logging workflow
