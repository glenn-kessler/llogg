# Claude Code Project Notes - llogg

This file contains important information about the llogg project to help Claude Code work effectively.

## Project Overview
llogg is a lightweight, privacy-first personal data tracking Progressive Web App (PWA) built with vanilla JavaScript.

## Important Project-Specific Information

### Automatic Version Incrementing
**IMPORTANT:** This project uses a git pre-commit hook to automatically increment the version number.

- **Location**: `.git/hooks/pre-commit`
- **Behavior**: Automatically increments the patch version in `public/version.js` on every commit
- **Example**: `1.7.18` → `1.7.19`
- **DO NOT**: Manually edit version numbers in `public/version.js` unless testing
- **Testing**: If you need to manually set a version for testing (e.g., `1.7.19-test`), revert it before committing

### Version File
- **Path**: `public/version.js`
- **Format**: `const APP_VERSION = 'X.Y.Z';`
- **Used by**: Service worker and main app for cache management

## Project Structure

### Key Directories
- `public/` - Deployable application files
- `public/src/` - JavaScript modules
- `public/src/lib/` - Core libraries (dataService, db, etc.)
- `public/src/components/` - UI components
- `.claude/` - Claude Code configuration

### Important Files
- `REQUIREMENTS.md` - Functional requirements specification (German)
- `public/src/main.js` - Main application controller
- `public/src/lib/dataService.js` - CRUD operations for IndexedDB
- `public/version.js` - Application version (auto-incremented)

## Development Workflow

### Testing
```bash
cd public
python3 -m http.server 8000
# Open http://localhost:8000
```

### Committing Changes
1. Make your changes to source files
2. Update `REQUIREMENTS.md` if needed (add changelog entry, update requirements table)
3. **DO NOT** manually change `public/version.js`
4. Commit - the pre-commit hook will auto-increment the version
5. The hook adds `public/version.js` to the commit automatically

### Counter Behavior (as of v1.7.19)
- Counters ALWAYS start at 0 when selecting a type
- No prefilling with previous values
- Changes lost on back button or leaving log view
- Only "Commit Log" persists values to database

## Code Style & Patterns

### Data Flow
1. **Type Selection** → Load details → Reset counters to 0
2. **Increment/Decrement** → Update state.detailCounts
3. **Commit Log** → Save to IndexedDB → Reset state → Return to type selection

### Important State Variables
- `state.detailCounts` - Temporary counter values (NOT persisted until commit)
- `state.configMode` - Boolean for configuration mode
- `state.selectedType` - Currently selected type object

### Database Operations
- Use functions from `dataService.js` for all DB operations
- Always use async/await for database calls
- IndexedDB stores: TYPES, DETAILS, ENTRIES, CONFIG

## Requirements Documentation

### Format
- German language
- Table format with columns: Done | ID | Kategorie | Anforderungstext
- Changelog at bottom with version entries

### Changelog Entries
When adding features or fixes:
1. Add new version section at top of changelog
2. Format: `### Version X.Y.Z (YYYY-MM-DD)`
3. Include: Funktion/Bugfix, Verbesserung, UX, Technisch, Beispiel bullets
4. Use past tense in German

## Common Tasks

### Adding a New Feature
1. Add requirement to REQUIREMENTS.md table
2. Implement in appropriate files
3. Add changelog entry to REQUIREMENTS.md
4. Commit (version auto-increments)

### Bug Fixes
1. Document bug in a BUG_*.md file (optional but helpful)
2. Fix the code
3. Add changelog entry noting the bugfix
4. Commit

### Removing a Feature
1. Update requirement status from "Yes" to "No" in table
2. Add **ENTFERNT** or **REMOVED** note in requirement text
3. Remove code
4. Mark old changelog entry as withdrawn
5. Add new changelog entry for removal
6. Commit

## Notes for Claude Code

- This project values simplicity over complexity
- Avoid over-engineering solutions
- User prefers clear, predictable behavior
- When in doubt about versioning: let git handle it automatically
- Test files are named `TEST_*.md` or `test-*.js`
- Bug reports are named `BUG_*.md`

## Contact & Feedback
- GitHub Issues: https://github.com/anthropics/claude-code/issues (for Claude Code feedback)
- Project maintained by: bbb
