# Test Plan: Counter Pre-fill Bug Fix

## Fix Summary
Applied fix to prevent counter pre-fill values from persisting in config mode.

## Changes Made

### 1. Modified `selectType()` (line 472-477)
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

### 2. Modified `enterConfigMode()` (line 1405-1410)
```javascript
// Added:
resetDetailCounts(); // Clear prefilled counters when entering config mode
```

### 3. Modified `exitConfigMode()` (line 1412-1422)
```javascript
// Changed to async and added:
await prefillDetailCounts(state.details); // Restore prefilled counters when exiting
```

## Test Cases

### Test 1: Normal Logging Flow (Prefill Should Work)
**Steps:**
1. Open http://localhost:8000
2. Select a type that has existing entries (e.g., "Mood")
3. **Expected**: Counters show last logged values (e.g., Happy=4)
4. Click "+" to increment
5. **Expected**: Counter increments from prefilled value (4→5)
6. **Result**: ✅ PASS / ❌ FAIL

### Test 2: Config Mode Entry (Counters Should Clear)
**Steps:**
1. Select a type with existing entries
2. **Verify**: Counters show prefilled values
3. Click gear icon to enter config mode
4. **Expected**: Counters should disappear or show 0
5. **Result**: ✅ PASS / ❌ FAIL

### Test 3: Edit Detail in Config Mode (Bug Scenario)
**Steps:**
1. Select a type with existing entries
2. Enter config mode
3. Click on a detail's icon to edit it
4. Change the icon/color and save
5. **Expected**: Counters remain at 0 (no prefilled values)
6. **Previous Bug**: Counters showed prefilled values >0
7. **Result**: ✅ PASS / ❌ FAIL

### Test 4: Exit Config Mode (Prefill Should Restore)
**Steps:**
1. While in config mode (counters at 0)
2. Click "← Leave Config Mode"
3. **Expected**: Counters should restore prefilled values
4. **Result**: ✅ PASS / ❌ FAIL

### Test 5: Type Selection in Config Mode
**Steps:**
1. In config mode, go back to type selection
2. Select a different type
3. **Expected**: Counters should be at 0 (not prefilled)
4. **Result**: ✅ PASS / ❌ FAIL

### Test 6: Back Button Behavior
**Steps:**
1. Select type (counters prefilled)
2. Click back button
3. Select same type again
4. **Expected**: Counters should be prefilled again
5. **Result**: ✅ PASS / ❌ FAIL

### Test 7: Commit and Reset
**Steps:**
1. Select type with prefilled counters
2. Adjust counters and commit
3. **Expected**: Returns to type selection
4. Select type again
5. **Expected**: Counters show newly committed values
6. **Result**: ✅ PASS / ❌ FAIL

## Manual Testing Instructions

1. Start server: `cd ~/projects/llogg/public && python3 -m http.server 8000`
2. Open browser: http://localhost:8000
3. If no data exists, import test data: `test-data-mood-2weeks.csv`
4. Execute each test case above
5. Mark results as PASS or FAIL

## Expected Behavior Summary

| Scenario | Counter State |
|----------|---------------|
| Select type (logging mode) | Prefilled with last values |
| Enter config mode | Cleared to 0 |
| Edit detail in config mode | Remain at 0 |
| Exit config mode | Restored to prefilled values |
| Select type (config mode) | Cleared to 0 |
| Commit log | Reset to 0, then back to type selection |

## Regression Testing

Ensure the original prefill feature still works:
- ✅ Prefill loads last count for each detail
- ✅ Increment/decrement works from prefilled value
- ✅ Back button clears counts
- ✅ After commit, re-selecting shows new values

## Test Server

Currently running on: http://localhost:8000
Stop with: `pkill -f "python3 -m http.server 8000"`
