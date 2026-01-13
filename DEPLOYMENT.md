# Life Logger - Deployment Guide

**Version:** 1.2
**Datum:** 2026-01-13

---

## Smartphone-Installation auf eigener Domain

### Voraussetzungen

- ✅ Domain mit HTTPS (SSL-Zertifikat erforderlich für PWA)
- ✅ Webserver oder Hosting-Service
- ✅ FTP/SFTP Zugriff oder Web-Interface zum Upload

---

## Schritt 1: Icons generieren

### Option A: Im Browser generieren (Empfohlen)

1. **Öffne im Browser:**
   ```
   http://localhost:8000/generate-icons.html
   ```

2. **Klicke auf "Generate Icons"**

3. **Lade beide Icons herunter:**
   - `icon-192.png` (192x192 Pixel)
   - `icon-512.png` (512x512 Pixel)

4. **Speichere die Icons im `public/` Ordner:**
   ```
   /home/bbb/life-logger/public/icon-192.png
   /home/bbb/life-logger/public/icon-512.png
   ```

---

## Deployment auf deiner Domain

### Schritt 1: Icons generieren

```bash
# Öffne im Browser:
http://localhost:8000/generate-icons.html

# Klicke auf "Generate Icons"
# Lade beide Icons herunter
# Speichere sie im public/ Ordner
```

### Schritt 2: Dateien auf Server hochladen

Du musst den kompletten `public/` Ordner auf deinen Webserver hochladen:

```
public/
├── index.html
├── styles.css
├── manifest.json
├── sw.js
├── icon-192.png         ← Neu erstellt
├── icon-512.png         ← Neu erstellt
└── src/
    ├── main.js
    └── lib/
        ├── db.js
        ├── dataService.js
        └── csvService.js
```

**Wichtig:**
- **HTTPS ist erforderlich** für PWA-Installation
- Alle Dateien müssen unter derselben Domain liegen
- Service Worker benötigt HTTPS (außer localhost)

### Schritt 3: Upload-Methoden

#### Option A: FTP/SFTP Upload

```bash
# Mit FileZilla, WinSCP oder Kommandozeile
# Verbinde zu deinem Server
# Lade den kompletten public/ Ordner hoch
# Stelle sicher, dass index.html im Root liegt
```

#### Option B: Git Deployment (wenn Server Git unterstützt)

```bash
# Auf deinem Server:
cd /var/www/deine-domain.de
git clone https://github.com/username/life-logger.git
cd life-logger
cp -r public/* /var/www/deine-domain.de/
```

#### Option C: Web-Interface Upload

1. Öffne Hosting Control Panel (z.B. cPanel, Plesk)
2. Navigiere zu "Datei-Manager" oder "File Manager"
3. Gehe zu `/public_html/` oder `/htdocs/`
4. Lade alle Dateien aus dem `public/` Ordner hoch
5. Stelle sicher, dass die Struktur erhalten bleibt

### Schritt 4: HTTPS konfigurieren

**Falls noch nicht vorhanden:**

1. **Let's Encrypt (kostenlos):**
   ```bash
   # Auf deinem Server
   sudo certbot --nginx -d deine-domain.de
   ```

2. **Oder über Hosting-Panel:**
   - cPanel: SSL/TLS → Let's Encrypt aktivieren
   - Plesk: SSL/TLS Zertifikate → Let's Encrypt

### Schritt 5: Testen

1. **Öffne im Desktop-Browser:**
   ```
   https://deine-domain.de/
   ```

2. **Prüfe:**
   - ✅ App lädt korrekt
   - ✅ Keine Console-Fehler (F12 → Console)
   - ✅ HTTPS-Zertifikat gültig (Schloss-Symbol in URL-Leiste)
   - ✅ Service Worker registriert (F12 → Application → Service Workers)

3. **Öffne auf Smartphone:**
   ```
   https://deine-domain.de/
   ```

---

## Schritt 6: PWA auf Smartphone installieren

### Android (Chrome)

1. Öffne `https://deine-domain.de/` in Chrome
2. Tippe auf **Menü (⋮)** oben rechts
3. Wähle **"Zum Startbildschirm hinzufügen"** oder **"App installieren"**
4. Bestätige den Namen "Life Logger"
5. App erscheint auf dem Startbildschirm

**Alternative:**
- Chrome zeigt automatisch einen "Installieren"-Banner am unteren Bildschirmrand

### iOS (Safari)

1. Öffne `https://deine-domain.de/` in Safari
2. Tippe auf **Teilen-Button** (Quadrat mit Pfeil nach oben)
3. Scrolle nach unten zu **"Zum Home-Bildschirm"**
4. Bestätige den Namen "Life Logger"
5. App erscheint auf dem Home-Bildschirm

---

## Troubleshooting

### Problem: "Zum Startbildschirm hinzufügen" Option fehlt

**Lösung:**
- ✅ Prüfe: HTTPS aktiviert?
- ✅ Prüfe: `manifest.json` vorhanden und korrekt?
- ✅ Prüfe: Icons existieren (`icon-192.png`, `icon-512.png`)?
- ✅ Prüfe: Service Worker lädt korrekt?

**In Chrome DevTools (F12):**
```
Application → Manifest → Überprüfe alle Felder
Application → Service Workers → Status "activated"
```

### Problem: Service Worker registriert nicht

**Lösung:**
```javascript
// Browser Console (F12 → Console)
// Prüfe ob Service Worker registriert ist:
navigator.serviceWorker.getRegistrations().then(console.log);

// Falls leer, prüfe sw.js URL:
fetch('/sw.js').then(r => console.log('SW Status:', r.status));
```

### Problem: Icons werden nicht angezeigt

**Lösung:**
```bash
# Prüfe ob Icons existieren:
curl -I https://deine-domain.de/icon-192.png
curl -I https://deine-domain.de/icon-512.png

# Sollte "200 OK" zurückgeben
```

**Im Browser:**
```
https://deine-domain.de/icon-192.png
https://deine-domain.de/icon-512.png

# Icons sollten direkt anzeigbar sein
```

### Problem: App funktioniert nicht offline

**Lösung:**
1. Service Worker neu registrieren:
   ```javascript
   // In Browser Console:
   navigator.serviceWorker.getRegistrations()
     .then(regs => regs.forEach(reg => reg.unregister()));

   // Seite neu laden (Hard Refresh: Ctrl+Shift+R)
   ```

2. Cache leeren:
   - Chrome: F12 → Application → Clear storage → Clear site data

---

## Manifest.json Konfiguration

Die `manifest.json` ist bereits korrekt konfiguriert:

```json
{
  "name": "Life Logger",
  "short_name": "LifeLog",
  "description": "Personal data tracking and logging application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a1a",
  "theme_color": "#3498db",
  "orientation": "portrait",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Anpassungen (optional):**
- `start_url`: Ändere zu `/app/` falls in Unterverzeichnis
- `theme_color`: Farbe der Browser-Leiste (aktuell Blau #3498db)
- `orientation`: `"portrait"` (Hochformat) oder `"any"` (frei drehbar)

---

## Webserver-Konfiguration

### Apache (.htaccess)

Falls Service Worker nicht lädt, füge zu `.htaccess` hinzu:

```apache
# Service Worker MIME-Type
<IfModule mod_mime.c>
    AddType application/javascript .js
</IfModule>

# HTTPS Redirect (optional)
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Cache-Control für Service Worker
<FilesMatch "sw\.js$">
    Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
</FilesMatch>
```

### Nginx (nginx.conf)

```nginx
location / {
    root /var/www/life-logger/public;
    index index.html;
    try_files $uri $uri/ /index.html;
}

# Service Worker keine Cache
location = /sw.js {
    add_header Cache-Control "max-age=0, no-cache, no-store, must-revalidate";
}

# HTTPS Redirect
server {
    listen 80;
    server_name deine-domain.de;
    return 301 https://$server_name$request_uri;
}
```

---

## Checkliste vor Deployment

- [ ] Icons generiert (`icon-192.png`, `icon-512.png`)
- [ ] Alle Dateien aus `public/` Ordner auf Server hochgeladen
- [ ] HTTPS aktiviert und funktionsfähig
- [ ] `manifest.json` korrekt (URL mit Browser prüfen)
- [ ] Service Worker lädt (`/sw.js` aufrufbar)
- [ ] App im Desktop-Browser getestet
- [ ] PWA-Installation auf Android getestet
- [ ] PWA-Installation auf iOS getestet (optional)
- [ ] IndexedDB funktioniert (Einträge speicherbar)
- [ ] Offline-Funktionalität getestet (Flugmodus aktivieren)

---

## Support-URLs für PWA-Prüfung

**Manifest Validator:**
```
https://manifest-validator.appspot.com/
```

**Lighthouse Audit (Chrome DevTools):**
```
F12 → Lighthouse → Progressive Web App → Generate report
```

**PWA Builder (Microsoft):**
```
https://www.pwabuilder.com/
```

---

## Nächste Schritte nach Deployment

### 1. Domain-spezifische Anpassungen

Falls du die App unter einem Unterverzeichnis hostest:

```json
// manifest.json anpassen:
{
  "start_url": "/life-logger/",
  "scope": "/life-logger/"
}
```

```javascript
// sw.js anpassen (Zeile 5):
const CACHE_NAME = 'life-logger-v1.2';
const urlsToCache = [
  '/life-logger/',
  '/life-logger/index.html',
  // ... weitere Pfade mit /life-logger/ Prefix
];
```

### 2. App Store Veröffentlichung (Optional)

Falls du die App später im Play Store/App Store anbieten möchtest:

**Android (Google Play):**
- Nutze **TWA (Trusted Web Activity)** oder **PWA Builder**
- Keine Neuprogrammierung nötig
- Kostenlos außer Play Store Gebühr ($25 einmalig)

**iOS (App Store):**
- Nutze **Capacitor** oder **Cordova**
- Benötigt Apple Developer Account ($99/Jahr)

### 3. Analytics (Optional)

Falls du Nutzungsstatistiken möchtest:

```html
<!-- In index.html vor </head> -->
<script async src="https://umami.deine-domain.de/script.js"
        data-website-id="xxx"></script>
```

**Empfohlene Privacy-First Analytics:**
- Umami (selbst gehostet)
- Plausible (selbst gehostet oder SaaS)
- Simple Analytics

---

## Kontakt & Updates

**Repository:**
```bash
git remote add origin https://github.com/username/life-logger.git
git push -u origin main
```

**Updates deployen:**
```bash
# Änderungen committen
git add .
git commit -m "Feature: Neue Funktionalität"
git push

# Auf Server:
git pull
cp -r public/* /var/www/deine-domain.de/
```

---

**Erstellt:** 2026-01-13
**Version:** 1.2
**Autor:** bbb
**Status:** Ready for Production Deployment