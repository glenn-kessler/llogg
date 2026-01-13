# Git Version Control - Life Logger

**Repository initialisiert:** 2026-01-13
**Branch:** main
**Autor:** bbb <bbb@local>

---

## Aktueller Status

```bash
# Status prüfen
git status

# Commit-Historie anzeigen
git log --oneline --graph

# Änderungen anzeigen
git diff
```

---

## Häufige Git-Befehle

### 1. Änderungen committen

```bash
# Geänderte Dateien anzeigen
git status

# Alle Änderungen zum Staging hinzufügen
git add .

# Spezifische Datei hinzufügen
git add public/src/main.js

# Commit erstellen
git commit -m "Beschreibung der Änderung"
```

### 2. Änderungen anzeigen

```bash
# Änderungen im Working Directory
git diff

# Änderungen im Staging Area
git diff --staged

# Änderungen in spezifischer Datei
git diff public/src/main.js
```

### 3. Historie anzeigen

```bash
# Kompakte Historie
git log --oneline

# Detaillierte Historie mit Statistiken
git log --stat

# Grafische Darstellung
git log --oneline --graph --all

# Letzten Commit anzeigen
git log -1
```

### 4. Dateien rückgängig machen

```bash
# Änderung in Datei verwerfen (ACHTUNG: Verlust der Änderungen!)
git checkout -- public/src/main.js

# Alle Änderungen verwerfen
git checkout -- .

# Datei aus Staging entfernen (Änderungen bleiben)
git reset HEAD public/src/main.js
```

### 5. Branches (für zukünftige Features)

```bash
# Neuen Branch erstellen
git branch feature/neue-funktion

# Zu Branch wechseln
git checkout feature/neue-funktion

# Branch erstellen und wechseln (kombiniert)
git checkout -b feature/neue-funktion

# Branches anzeigen
git branch

# Branch löschen
git branch -d feature/alte-funktion

# Branch mergen
git checkout main
git merge feature/neue-funktion
```

---

## Empfohlener Workflow

### Feature hinzufügen

```bash
# 1. Neuen Feature-Branch erstellen
git checkout -b feature/timestamp-dialog

# 2. Änderungen vornehmen
# ... Code editieren ...

# 3. Änderungen committen
git add public/src/main.js public/index.html public/styles.css
git commit -m "Add timestamp adjustment dialog

- Implemented incremental time intervals
- Added sign toggle for add/subtract
- Added glow effect on clock icon
- Implemented reset to now functionality"

# 4. Zu main zurückkehren und mergen
git checkout main
git merge feature/timestamp-dialog

# 5. Feature-Branch löschen (optional)
git branch -d feature/timestamp-dialog
```

### Bug Fix

```bash
# 1. Bug-Fix-Branch erstellen
git checkout -b bugfix/checkbox-state

# 2. Bug beheben
# ... Code editieren ...

# 3. Committen
git add .
git commit -m "Fix checkbox state not persisting after page reload

- Store checked details in localStorage
- Restore state on page load
- Clear state on exit config mode"

# 4. Mergen
git checkout main
git merge bugfix/checkbox-state
git branch -d bugfix/checkbox-state
```

### Dokumentation aktualisieren

```bash
# Direkter Commit auf main (für Dokumentation)
git add README.md PROJECT_STATE.md
git commit -m "Update documentation for v1.2 features

- Add checkbox bulk operations section
- Update timestamp adjustment details
- Add fixed positioning info for type buttons"
```

---

## Commit-Message-Konventionen

### Format

```
<type>: <subject>

<body>

<footer>
```

### Types

- **feat:** Neue Funktion
- **fix:** Bug-Fix
- **docs:** Dokumentationsänderungen
- **style:** Code-Formatierung (keine funktionalen Änderungen)
- **refactor:** Code-Umstrukturierung
- **test:** Tests hinzufügen oder ändern
- **chore:** Build-Prozess oder Tool-Änderungen

### Beispiele

```bash
# Neue Funktion
git commit -m "feat: Add bulk detail reassignment with checkboxes

- Implement checkboxes in config mode
- Add Move [Type] button with dynamic type name
- Add Delete Checked button
- Create move dialog for target type selection"

# Bug-Fix
git commit -m "fix: Type management buttons now stay at screen bottom

- Change from relative to fixed positioning
- Set bottom: 60px to stay above nav bar
- Add box-shadow for visual separation"

# Dokumentation
git commit -m "docs: Update req.md to German with repetitive wording

- Translate all requirements to German
- Use 'Das System soll...' pattern
- Add Version 1.2 changelog
- Document all new features"

# Refactoring
git commit -m "refactor: Extract timestamp adjustment to separate module

- Move timestamp logic to lib/timestampService.js
- Reduce main.js complexity
- Improve code organization"
```

---

## .gitignore

Folgende Dateien/Ordner werden NICHT versioniert:

```
# Dependencies
node_modules/
npm-debug.log*

# Build outputs
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Test coverage
coverage/

# Environment files
.env
.env.local
.env.*.local

# Temporary files
*.tmp
tmp/
temp/
```

---

## Nützliche Git-Aliase (Optional)

Füge zu `~/.gitconfig` hinzu:

```ini
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = log --oneline --graph --all
    amend = commit --amend --no-edit
```

Verwendung:
```bash
git st                  # statt git status
git co main            # statt git checkout main
git br                 # statt git branch
git visual             # Grafische Log-Darstellung
```

---

## Wichtige Hinweise

### ⚠️ Vor jedem Commit

1. Prüfen: `git status` - Was wird committed?
2. Prüfen: `git diff --staged` - Welche Änderungen sind dabei?
3. Testen: Funktioniert die Anwendung noch?
4. Committen: Aussagekräftige Commit-Message schreiben

### ⚠️ Niemals committen

- Passwörter oder API-Keys
- Große Binärdateien (>10 MB)
- Build-Artefakte (dist/, node_modules/)
- IDE-spezifische Dateien
- Temporäre Dateien

### ⚠️ Remote Repository (zukünftig)

Wenn du das Projekt zu GitHub/GitLab pushen möchtest:

```bash
# Remote hinzufügen
git remote add origin https://github.com/username/life-logger.git

# Zu Remote pushen
git push -u origin main

# Von Remote pullen
git pull origin main
```

---

## Troubleshooting

### "Merge Conflict"

```bash
# 1. Konflikt-Dateien anzeigen
git status

# 2. Dateien manuell editieren (Konflikt-Marker entfernen)
# <<<<<<< HEAD
# ... deine Änderungen ...
# =======
# ... andere Änderungen ...
# >>>>>>> branch-name

# 3. Konflikt als gelöst markieren
git add konflikt-datei.js

# 4. Merge abschließen
git commit
```

### Letzten Commit rückgängig machen

```bash
# Commit behalten, Änderungen in Staging
git reset --soft HEAD~1

# Commit UND Änderungen verwerfen (ACHTUNG!)
git reset --hard HEAD~1
```

### Commit-Message ändern (letzter Commit)

```bash
git commit --amend -m "Neue Commit-Message"
```

---

**Erstellt:** 2026-01-13
**Version:** 1.0
**Für:** Life Logger PWA v1.2
