# Life Logger PWA v1.7

A lightweight, privacy-first personal data tracking Progressive Web App.

## Quick Start

```bash
cd public
python3 -m http.server 8000
# Open http://localhost:8000
```

## Documentation

- **DOCUMENTATION.md** - Complete documentation (deployment, git, testing, troubleshooting)
- **REQUIREMENTS.md** - Functional requirements specification (German)
- **CHANGELOG.md** - Version history and change log
- **CLEANUP_SUMMARY.txt** - Project structure summary

## Deployment

**For root domain (`https://example.com/`):**
- Upload contents of `public/` folder

## Project Structure

```
├── DOCUMENTATION.md                      # Complete docs
├── REQUIREMENTS.md                       # Functional requirements
├── CHANGELOG.md                          # Version history
├── CLEANUP_SUMMARY.txt                   # Project structure overview
├── README.md                             # This file
├── .claude/                              # Claude Code configuration
│   ├── README.md                         # Project documentation for Claude Code
│   └── settings.json                     # Claude Code permissions
├── index-subfolder.html                  # For subfolder deployment
├── manifest-subfolder.json               # For subfolder deployment
├── sw-subfolder.js                       # For subfolder deployment
└── public/                               # Deployable application
    ├── index.html                        # Main UI
    ├── styles.css                        # Styles
    ├── manifest.json                     # PWA manifest
    ├── sw.js                             # Service Worker
    ├── icon-192.png                      # PWA icon
    ├── icon-512.png                      # PWA icon
    ├── generate-icons.html               # Icon generator
    ├── test/                             # Test files
    │   └── TEST_automated.html           # Automated test suite
    │   └── TEST_debug_comprehensive.html # Module loading diagnostics
    │   └── TEST_debug_simple.html        # Basic diagnostics (no modules)
    │   └── TEST_label_interval.html      # X-axis label spacing tests
    │   └── TEST_last_count_prefill.md    #  Counter prefill test documentation
    └── src/                              # JavaScript modules
        ├── main.js                       # App controller
        ├── version.js                    # Version number (auto-incremented)
        ├── lib/                          # Core libraries
        │   ├── dataService.js
        │   ├── csvService.js
        │   └── charts.js
        └── components/                   # UI components
```

## Technology

- Vanilla JavaScript (ES6 modules)
- IndexedDB (client-side storage)
- Custom SVG charts with advanced time aggregation
- Service Worker (offline support)
- No build tools required
- Automatic version incrementing via git pre-commit hooks

### Frontend

- Vanilla JavaScript (ES6+) - No frameworks or libraries
- ES6 modules with import/export
- Async/await for database operations
- Modern JavaScript features

### Data Storage

- IndexedDB - Browser-based NoSQL database
- 4 object stores: types, details, entries, config
- Auto-increment primary keys
- Indexed queries for performance

### UI/Styling

- Custom CSS (no CSS frameworks)
- Flexbox and Grid layouts
- System font stack (no web fonts)
- Touch-optimized with 48px minimum touch targets
- Responsive design with media queries

### Charts/Visualization

- SVG - Custom chart rendering
- Bar charts (vertical & horizontal)
- Line charts
- Pie charts
- No charting libraries - all custom code

### PWA Features

- Service Worker - Offline capability
- Cache-first strategy
- Version-based cache management
- Auto-updates on new versions
- Web App Manifest - Installability
- Standalone display mode
- Custom icons (192x192, 512x512)
- Portrait orientation

### APIs Used

- localStorage - User preferences and presets
- SVG DOM API - Chart rendering
- Service Worker API - PWA functionality
- Web App Manifest - Installation

### Architecture Philosophy

The project follows a zero-dependency, browser-native approach:
- Everything runs in the browser
- No compilation or transpilation needed
- Works offline after first load
- Privacy-first (no external requests)
- Deploy by uploading files to any static host

## Features

- Type → Details → Count logging flow
- CSV export/import with human-readable format
- Interactive charts (Bar, Line, Pie, Horizontal Bar)
- Advanced time-based chart aggregation (Hours/Days/Weeks/Months/Years)
- Intelligent X-axis label spacing
- Time range navigation with arrow buttons
- View filter presets (save/load configurations)
- PWA support (installable, offline)
- Touch-optimized mobile UI
- Timestamp adjustment with commit workflow
- Dual-axis chart modes (Time/Item-based)
- Bulk operations (move/delete details)

## Testing

Test files are located in `public/test/`:

## License

Open Source (MIT)
