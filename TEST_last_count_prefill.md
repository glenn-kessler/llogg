# Test: Last Count Pre-fill Feature

## Feature Description
When selecting a type and viewing its details, the counter fields should be pre-filled with the last count value that was logged for each detail.

## Test Steps

### Setup
1. Open the llogg application (index.html)
2. Import test data from `test-data-mood-2weeks.csv` if not already loaded
3. Clear browser cache and reload if needed to ensure clean state

### Test Case 1: Pre-fill from Existing Data
1. Go to the "Log" tab
2. Click on "Mood" type
3. **Expected**: The detail counters should show the last count values from the database
   - Example: If "Happy" was last logged with count=4, the counter should show 4
   - If a detail has never been logged, counter should show 0

### Test Case 2: Increment Pre-filled Value
1. After selecting "Mood" type (with pre-filled values)
2. Click the "+" button on a detail (e.g., "Happy")
3. **Expected**: Counter should increment from the pre-filled value (e.g., 4 → 5)

### Test Case 3: Decrement Pre-filled Value
1. After selecting "Mood" type (with pre-filled values)
2. Click the "-" button on a detail
3. **Expected**: Counter should decrement from the pre-filled value (e.g., 4 → 3)
4. Counter should not go below 0

### Test Case 4: Commit New Entry with Pre-filled Value
1. Select "Mood" type (counters pre-filled)
2. Optionally adjust counters
3. Click "Commit Log"
4. **Expected**: Entry is saved with the current counter value
5. Return to type selection, then select "Mood" again
6. **Expected**: Counters now show the values from the entry you just committed

### Test Case 5: Back Button Clears Counts
1. Select "Mood" type (counters pre-filled)
2. Modify some counters
3. Click the back button (← icon)
4. **Expected**: Return to type selection, counters are cleared
5. Select "Mood" again
6. **Expected**: Counters are pre-filled again from database (not showing the modifications)

### Test Case 6: Multiple Details Same Type
1. Select "Mood" type
2. **Expected**: Each detail (Happy, Sad, Neutral, etc.) should have its own last count value
3. Each counter should be independent and show its specific last logged value

### Test Case 7: No Previous Data
1. Create a new detail that has never been logged
2. Select the type containing this new detail
3. **Expected**: New detail shows counter = 0
4. Existing details still show their last count values

## Implementation Details

### New Function: `getLastCountForDetail(detailId)`
- Location: `public/src/lib/dataService.js`
- Queries all entries for a specific detail ID
- Sorts by timestamp (descending)
- Returns the count from the most recent entry
- Returns 0 if no entries exist

### New Function: `prefillDetailCounts(details)`
- Location: `public/src/main.js`
- Called when selecting a type (replaces resetDetailCounts in selectType)
- Iterates through all details
- Calls getLastCountForDetail for each detail
- Pre-fills state.detailCounts with last values

### Modified Function: `selectType(type)`
- Location: `public/src/main.js`
- Changed from `resetDetailCounts()` to `await prefillDetailCounts(state.details)`
- Now asynchronously loads last counts before rendering

## Expected Behavior Summary

✅ Counters pre-filled when selecting a type
✅ Values come from the most recent entry per detail
✅ Counters can still be incremented/decremented normally
✅ Back button still clears counts (uses resetDetailCounts)
✅ After commit, page resets (uses resetDetailCounts)
✅ Re-selecting a type loads fresh pre-filled values

## Notes
- This feature makes logging faster for users who often log similar values
- Pre-filling happens only on type selection, not on page load
- The resetDetailCounts() function is preserved for use after commits and when going back
