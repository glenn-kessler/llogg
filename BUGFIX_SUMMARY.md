# Bug Fix Summary: Counter Pre-fill in Config Mode

## Problem
When editing a detail's appearance (icon/color) in config mode, counters showed pre-filled values >0 instead of being at 0. This was confusing because you're editing configuration, not logging data.

## Root Cause
The counter pre-fill feature (commit f1f6a00) loads last logged values when selecting a type. However, when entering config mode or editing details, these pre-filled values persisted because:
1. `enterConfigMode()` didn't clear the counters
2. `selectType()` always prefilled, even in config mode
3. `exitConfigMode()` didn't restore prefilled values when returning to logging mode

## Solution Applied

### Changes Made (public/src/main.js)

#### 1. Conditional Prefill in `selectType()` (lines 472-477)
```javascript
// Before:
await prefillDetailCounts(state.details);

// After:
if (!state.configMode) {
  await prefillDetailCounts(state.details);
} else {
  resetDetailCounts();
}
```
**Rationale**: Only prefill counters in logging mode, not config mode.

#### 2. Clear Counters in `enterConfigMode()` (line 1408)
```javascript
function enterConfigMode() {
  state.configMode = true;
  state.markedForDeletion.clear();
  resetDetailCounts(); // NEW: Clear prefilled counters
  renderDetailList();
}
```
**Rationale**: When entering config mode, clear counters since we're not logging.

#### 3. Restore Counters in `exitConfigMode()` (lines 1412-1422)
```javascript
// Changed to async
async function exitConfigMode() {
  state.configMode = false;
  state.detailUnitChanges = {};
  state.markedForDeletion.clear();
  state.checkedDetails.clear();

  // NEW: Restore prefilled counters when returning to logging mode
  await prefillDetailCounts(state.details);

  renderDetailList();
}
```
**Rationale**: When exiting config mode back to logging, restore the prefilled values.

#### 4. Updated Callers to Handle Async (lines 124, 492, 1542)
```javascript
// Back button handler
await exitConfigMode();

// Leave Config Mode button
addEventListener('click', async () => await exitConfigMode());

// Store config handler
await exitConfigMode();
```
**Rationale**: `exitConfigMode()` is now async, so callers must await it.

## Expected Behavior After Fix

| User Action | Counter State |
|-------------|---------------|
| Select type (logging mode) | ✅ Prefilled with last values |
| Enter config mode | ✅ Cleared to 0 |
| Edit detail in config mode | ✅ Remain at 0 |
| Exit config mode | ✅ Restored to prefilled values |
| Commit log | ✅ Reset, return to type selection |

## Testing Performed

### Manual Test Cases
1. **Normal logging flow**: ✅ Counters prefill correctly
2. **Enter config mode**: ✅ Counters clear to 0
3. **Edit detail appearance**: ✅ Counters stay at 0 (bug fixed)
4. **Exit config mode**: ✅ Counters restore to prefilled values
5. **Commit and re-select**: ✅ Counters show new values

### Regression Testing
- ✅ Prefill feature still works in logging mode
- ✅ Increment/decrement from prefilled values works
- ✅ Back button clears counts as expected
- ✅ After commit, re-selecting type shows new values

## Files Modified
- `public/src/main.js` - 5 changes across 4 functions

## Files Created
- `BUG_counter_prefill_on_edit.md` - Detailed bug report
- `TEST_counter_prefill_fix.md` - Test plan
- `BUGFIX_SUMMARY.md` - This file

## Backwards Compatibility
✅ No breaking changes. All existing functionality preserved.

## Performance Impact
✅ Negligible - same prefill logic, just conditional execution.

## Introduced In
- Bug appeared in: commit f1f6a00 (Jan 21, 2026)
- Fixed in: This commit

## Verified Against
- Earlier version (06c223c): Bug did not exist (used `resetDetailCounts()`)
- Current version (main): Bug confirmed and fixed
