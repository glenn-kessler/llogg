# Life Logger

A lightweight, privacy-first personal data tracking application built with vanilla JavaScript and modern web technologies.

## Features

### MVP (Version 1.0)
- ✅ **Core Data Entry**: Track personal data with Type → Details → Count flow
- ✅ **Local Storage**: All data stored in IndexedDB (browser-based)
- ✅ **Data Review**: View entries with filters by type and time span
- ✅ **Visualizations**: Bar, Line, and Pie charts (SVG-based)
- ✅ **CSV Export/Import**: Manual backup and restore functionality
- ✅ **Manage Definitions**: Create and customize Types and Details
- ✅ **PWA Support**: Install as standalone app, works offline
- ✅ **Touch-Friendly**: Optimized for mobile devices
- ✅ **Fast**: <500ms query time for 10k entries

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6 Modules)
- **Database**: IndexedDB (native browser API)
- **Charts**: Custom SVG rendering
- **PWA**: Service Worker for offline support
- **No Build Step Required**: Runs directly in modern browsers

## Browser Compatibility

Tested and supported in:
- Chrome 90+ (Desktop & Mobile)
- Firefox 88+ (Desktop & Mobile)
- Safari 14+ (Desktop & Mobile)

## Getting Started

### Local Development

1. **Clone or download** this repository

2. **Serve the files** with any static web server:

   ```bash
   # Using Python
   cd life-logger/public
   python3 -m http.server 8000

   # Using Node.js (http-server)
   npx http-server life-logger/public -p 8000

   # Using PHP
   cd life-logger/public
   php -S localhost:8000
   ```

3. **Open in browser**: Navigate to `http://localhost:8000`

4. **Start logging!** The app will automatically create dummy data on first run.

### Deployment

Deploy the `public` folder to any static hosting service:

- **GitHub Pages**: Push to `gh-pages` branch
- **Netlify**: Drag & drop the `public` folder
- **Vercel**: Connect repository and set build directory to `public`

## Usage

### Logging an Entry (3-Click Flow)

1. **Select Type** (e.g., Mood, Activity)
2. **Select Details** (e.g., Happy, Running)
3. **Set Count** and tap **Log Entry**

### Viewing Data

1. Navigate to **View** page
2. Select filters (Types, Time Span)
3. Choose chart type (Bar, Line, Pie)
4. Tap **Apply**

### Managing Definitions

1. Go to **Settings** → **Manage Entry Definitions**
2. Add new Types or Details
3. Set colors and icons (1-2 characters)
4. Define units of measurement (optional)

### Export/Import Data

**Export:**
1. Settings → **Export Data (CSV)**
2. Save the downloaded CSV file

**Import:**
1. Settings → **Import Data (CSV)**
2. Select your previously exported CSV file

CSV Format:
```csv
id;timestamp;type_name;detail_name;count;unit
1;2026-01-12T14:23:45.123Z;Mood;Happy;1;
2;2026-01-12T15:30:12.456Z;Activity;Running;45;Minutes
```

## Architecture

```
life-logger/
├── public/
│   ├── index.html          # Main UI
│   ├── styles.css          # Responsive styles
│   ├── manifest.json       # PWA manifest
│   └── sw.js              # Service worker
└── src/
    ├── main.js            # App controller
    ├── lib/
    │   ├── db.js          # IndexedDB schema
    │   ├── dataService.js # CRUD operations
    │   └── csvService.js  # Import/Export
    └── components/
        └── charts.js      # SVG charts
```

## Data Schema

### Types
- `id`: Auto-increment integer
- `name`: Type name (e.g., "Mood")
- `color`: Hex color code
- `charIcon`: 1-2 character icon

### Details (1:n relationship with Types)
- `id`: Auto-increment integer
- `typeId`: Foreign key to Types
- `name`: Detail name (e.g., "Happy")
- `color`: Hex color code
- `charIcon`: 1-2 character icon
- `unit`: Optional unit of measurement

### Entries
- `id`: Auto-increment integer
- `typeId`: Foreign key to Types
- `detailId`: Foreign key to Details
- `count`: Positive number (≥1)
- `timestamp`: ISO 8601 datetime

## Performance

- **P95 Query Time**: <500ms for 10,000 entries
- **Scalability**: Handles 100,000+ entries
- **Indexes**: Optimized for time and type filtering

## Privacy & Security

- **Local-First**: All data stored in your browser
- **No Tracking**: No analytics, no external requests
- **No Server**: Runs entirely client-side
- **Manual Backups**: Export CSV for your own storage

## Roadmap (Future Features)

- [ ] GPS location tracking (F-2.2)
- [ ] Weather data integration (F-2.3)
- [ ] Health data sync (F-2.7)
- [ ] Cloud sync (F-3.5)
- [ ] Advanced visualizations (F-4.10)
- [ ] Data encryption
- [ ] Multi-device sync

## Requirements

See `req.md` for detailed functional and non-functional requirements.

## License

Open Source (MIT) - Free to use and modify

## Contributing

This is a personal project, but suggestions and bug reports are welcome!

## Support

For issues or questions, please open an issue on the repository.
