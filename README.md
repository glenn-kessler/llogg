# Life Logger PWA v1.2

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
- **CLEANUP_SUMMARY.txt** - Project structure summary

## Deployment

**For root domain (`https://example.com/`):**
- Upload contents of `public/` folder

**For subfolder (`https://example.com/llogg/`):**
1. Upload contents of `public/` folder to `/llogg/`
2. Replace these files:
   - `/llogg/index.html` ← `index-subfolder.html`
   - `/llogg/sw.js` ← `sw-subfolder.js`
   - `/llogg/manifest.json` ← `manifest-subfolder.json`

## Project Structure

```
├── DOCUMENTATION.md           # Complete docs
├── REQUIREMENTS.md            # Functional requirements
├── CLEANUP_SUMMARY.txt        # Project structure overview
├── README.md                  # This file
├── index-subfolder.html       # For subfolder deployment
├── manifest-subfolder.json    # For subfolder deployment
├── sw-subfolder.js           # For subfolder deployment (v2)
└── public/                    # Deployable application
    ├── index.html             # Main UI
    ├── styles.css             # Styles
    ├── manifest.json          # PWA manifest
    ├── sw.js                  # Service Worker
    ├── icon-192.png           # PWA icon
    ├── icon-512.png           # PWA icon
    ├── generate-icons.html    # Icon generator
    ├── TEST_*.html            # Test files
    └── src/                   # JavaScript modules
        ├── main.js            # App controller
        ├── lib/               # Core libraries
        └── components/        # UI components
```

## Technology

- Vanilla JavaScript (ES6 modules)
- IndexedDB (client-side storage)
- Custom SVG charts
- Service Worker (offline support)
- No build tools required

## Features

✅ Type → Details → Count logging flow
✅ IndexedDB local storage
✅ CSV export/import
✅ Interactive charts (Bar, Line, Pie)
✅ PWA support (installable, offline)
✅ Touch-optimized mobile UI
✅ Timestamp adjustment
✅ Bulk operations (move/delete details)

## Testing

- `TEST_automated.html` - Automated test suite
- `TEST_debug_comprehensive.html` - Module loading diagnostics
- `TEST_debug_simple.html` - Basic diagnostics (no modules)

## License

Open Source (MIT)
