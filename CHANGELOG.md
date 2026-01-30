# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

---

## Version 1.7.27 (2026-01-30)
- Dokumentation: REQUIREMENTS.md aufgeteilt in REQUIREMENTS.md und CHANGELOG.md
- Verbesserung: Anforderungen und Versionshistorie sind jetzt getrennte Dokumente
- Verbesserung: REQUIREMENTS.md fokussiert sich auf funktionale/nicht-funktionale Anforderungen
- Verbesserung: CHANGELOG.md enthält vollständige Versionshistorie (1.0 bis 1.7.27)
- Wartbarkeit: Versionsupdates ändern nur CHANGELOG.md
- Wartbarkeit: REQUIREMENTS.md bleibt stabil und lesbar
- Struktur: REQUIREMENTS.md verweist auf CHANGELOG.md für Versionshistorie

## Version 1.7.26 (2026-01-30)
- Technisch: Automatische Versionsinkrementierung durch pre-commit hook

## Version 1.7.25 (2026-01-30)
- Funktion: F-4.19 - Aufgeteilte Steuerung: "Time Span" und "Time Range" getrennt
- Funktion: "Time Span" zeigt [Wert][Einheit] in einer Zeile (z.B. [7][Days])
- Funktion: "Time Range" mit Pfeil-Buttons (← [Offset] →) zur Verschiebung
- Funktion: F-4.12 - Mehrzeilige Chart-Labels mit Monatswechsel-Erkennung
- Verbesserung: Stunden zeigen "15:00\n1.Jan" (Zeit + Datum.Monat)
- Verbesserung: Tage/Wochen zeigen Monat in zweiter Zeile
- Verbesserung: Bei Monatswechsel werden beide Monate angezeigt (z.B. "Mon\nJan  Feb")
- UX: Offset-Counter zeigt Anzahl der Zeitspannen-Verschiebung
- UX: Controls sind jetzt separate Zeilen für bessere Klarheit

## Version 1.7.24 (2026-01-30)
- Funktion: F-4.5 - "Years" zu Zeitspannen-Definition hinzugefügt
- Funktion: Zeitspannen-Einheiten: Hours/Days/Weeks/Months/Years
- Funktion: F-4.12 - Aktualisierte automatische Schrittgröße
  - 1 Tag → 3h Schritte (war 1h)
  - 2-7 Tage → 1 Tag Schritte
  - 1 Woche → 1 Tag Schritte
  - 2-4 Wochen → Kalenderwochen (KW1, KW2...)
  - 1 Monat → Kalenderwochen
  - 2-6 Monate → Monate (Jan, Feb...)
- Verbesserung: Mehrzeilige Labels mit Kontext (Wochentag/Monat)
- Verbesserung: Kalenderwochen-Nummern (KW) für wöchentliche Aggregation

## Version 1.7.23 (2026-01-30)
- Bugfix: Zeitstempel-Anpassung funktioniert jetzt korrekt (F-2.1.1)
- Bugfix: Offset wird nicht mehr zurückgesetzt bevor er verwendet wird
- Bugfix: "Apply" → "Commit Log" Workflow funktioniert
- Bugfix: "Commit Log" Button im Dialog funktioniert
- Fix: hideTimestampDialog() setzt timestampOffset nicht mehr vorzeitig zurück
- Verbesserung: Offset persistiert bis handleCommitLog() ihn nach Entry-Erstellung zurücksetzt

## Version 1.7.22 (2026-01-30)
- Funktion: Backward compatibility für legacy GPS-Daten in CSV-Imports
- Funktion: GPS-Spalten werden automatisch erkannt
- Funktion: Warnung wird angezeigt: "Warnings: 1"
- Verbesserung: Detaillierte Warnmeldung im Console-Log
- Verbesserung: GPS-Daten werden ignoriert, Import erfolgreich
- Anforderung: NF-1.12.1 - CSV-Import Backward Compatibility dokumentiert

## Version 1.7.21 (2026-01-30)
- **BREAKING:** GPS-Tracking-Funktionalität entfernt
- Entfernt: F-2.2 bis F-2.6 (GPS-Erfassung, Wetterdaten, etc.)
- Entfernt: GPS-Spalten aus CSV-Export/Import (latitude, longitude, accuracy)
- Entfernt: GPS-Parameter aus dataService.createEntry() Funktionen
- Entfernt: Geolocation API Aufrufe aus main.js
- Änderung: GPS ist nicht länger erforderlich für die Anwendung
- Verbesserung: Vereinfachte Codebasis ohne GPS-Abhängigkeiten

## Version 1.7.19 (2026-01-29)
- **BREAKING:** F-1.5.1 Zähler-Vorausfüllung komplett entfernt
- Bugfix: Zähler zeigten vorausgefüllte Werte auch im Konfigurationsmodus
- Änderung: Zähler starten IMMER bei 0 beim Auswählen eines Typs
- Änderung: Zähler-Werte werden NICHT mehr vorausgefüllt mit letzten Werten
- Änderung: Geänderte Zähler gehen verloren bei Zurück-Button oder Verlassen der Log-Ansicht
- Änderung: Nur "Commit Log" überträgt Zähler-Werte in die Datenbank
- Verbesserung: Klarere Trennung zwischen temporärem UI-Zustand und persistierten Daten
- Verbesserung: Kein unerwartetes Verhalten mehr beim Editieren von Detail-Eigenschaften
- Entfernt: prefillDetailCounts() Funktion aus main.js
- Entfernt: getLastCountForDetail() wird nicht mehr verwendet (bleibt in dataService.js für spätere Verwendung)
- Vereinfacht: selectType() ruft nur noch resetDetailCounts() auf
- Vereinfacht: enterConfigMode() und exitConfigMode() nicht mehr async
- Technisch: Konsistente Counter-Initialisierung auf 0 in allen Modi
- UX: Weniger verwirrend - Zähler verhalten sich vorhersehbar

### Version 1.7.14 (2026-01-28)
- Funktion: F-4.0.5 Erweiterung - Preset-Dropdown in beiden Aggregationsmodi sichtbar
- Verbesserung: Dropdown verschoben aus Detail-Gruppe in eigenständige Filter-Gruppe oberhalb Type/Detail-Auswahl
- Verbesserung: Preset kann jetzt auch wenn "By Type" aktiv ist geladen werden
- Verbesserung: Laden eines Presets wechselt automatisch auf "By Detail" und wendet Auswahl an
- UX: "Save Preset" Button bleibt in Detail-Gruppe (nur dort relevanz), Dropdown ist global

### Version 1.7.13 (2026-01-28)
- Funktion: F-4.0.5 Erweiterung - Presets speichern jetzt auch Darstellungseinstellungen
- Funktion: Gespeicherte Einstellungen: Chart-Typ, Achsen-Modus, Zeitspanne, Schrittgröße, Aggregationslevel
- Funktion: Neue capturePresetSettings() sammelt alle aktuellen Darstellungseinstellungen
- Funktion: Neue applyPresetSettings() setzt alle Einstellungen aus einem Preset ohne Fehlschlag bei fehlenden Schlüsseln
- Funktion: Automatische Migration alter Presets (Plain-Array-Format → neues Objekt-Format)
- Verbesserung: Preset-Format erweiterbar - neue Einstellungen werden zukünftig einfach zum settings-Objekt hinzugefügt
- Verbesserung: Beim Laden eines Presets werden Chart-Typ-Display, Zeitspannen-Display und Achsen-Button aktualisiert
- Technisch: Neues Preset-Schema: { detailIds: [...], settings: { chartType, axisMode, ... } }
- Technisch: getPresets() migriert automatisch Legacy-Presets beim ersten Zugriff
- Technisch: Unbekannte zukünftige settings-Schlüssel werden beim Laden einfach ignoriert

### Version 1.7.12 (2026-01-28)
- Funktion: F-4.0.5 - Gespeicherte Filter-Presets (Aliase) im View implementiert
- Funktion: "Save Preset" Button in Detail-Filterbereich speichert aktuelle Checkbox-Auswahl unter Alias
- Funktion: Dropdown für Preset-Auswahl erscheint automatisch wenn Presets vorhanden
- Funktion: Dropdown verschwindet automatisch wenn keine Presets gespeichert sind
- Funktion: Laden eines Presets wechselt automatisch auf "By Detail" Aggregationsmodus
- Verbesserung: Presets ermöglichen schnellen Wechsel zwischen häufig verwendeten Detail-Kombinationen
- UX: Dropdown zeigt "Load preset..." Platzhalter, wird nach Auswahl auf Platzhalter zurückgesetzt
- UX: Fehlermeldung wenn "Save Preset" ohne Auswahl gedrückt wird
- Technisch: Presets im localStorage unter 'llogg-view-presets' gespeichert
- Technisch: Neue Funktionen getPresets(), saveCurrentPreset(), loadPreset(), updatePresetDropdown() in main.js
- Technisch: updatePresetDropdown() wird in loadViewPage() nach Befüllung der Detail-Filter aufgerufen

### Version 1.7.11 (2026-01-28)
- Funktion: F-2.1.7 - "Commit Log" Button im Zeitstempel-Dialog implementiert
- Funktion: Bei vorhandenem Counter >0 erscheint grüner "Commit Log" Button im Zeitstempel-Dialog
- Funktion: Button kombiniert Zeitanpassung und Commit in einem Schritt ohne Rückkehr zur Detail-Liste
- Funktion: F-4.0.4 - Typ-Header in Detail-Filterung (View) anklickbar zum Umschalten aller Details eines Typs
- Verbesserung: Zeitstempel-Dialog bietet direkten Commit-Workflow für schnelles Loggen mit Zeitanpassung
- Verbesserung: Counter wird automatisch auf 1 gesetzt wenn bei 0 beim Commit-Klick im Dialog
- UX: Typ-Header im Detail-Filter-Bereich zeigt Cursor-Pointer zur Hinweis auf Klickbarkeit
- UX: Klick auf Typ-Header togglet alle Details dieses Typs (alle an wenn nicht alle an, sonst alle aus)
- Technisch: Neue applyTimestampAndCommit() Funktion in main.js
- Technisch: updateTimestampPreview() zeigt/versteckt Commit-Button basierend auf detailCounts
- Technisch: Detail-Checkboxes in populateDetailFilters() in Gruppen-Divs pro Typ gesammelt

### Version 1.7.10 (2026-01-21)
- Funktion: F-4.19 - Zeitbereichs-Navigation implementiert
- Funktion: Neue ← → Pfeil-Buttons zwischen - und + im Time Span Wert-Control
- Funktion: Navigation verschiebt Datenbereich um 1 Zeitspannen-Inkrement vor/zurück
- Funktion: Neue state.timeRangeOffset Variable trackt aktuelle Navigation-Position
- Verbesserung: Linker Pfeil (←) navigiert rückwärts in der Zeit (zeigt ältere Daten)
- Verbesserung: Rechter Pfeil (→) navigiert vorwärts in der Zeit (begrenzt auf "heute")
- Verbesserung: Offset wird automatisch auf 0 zurückgesetzt beim Ändern von Unit oder Value
- UX: Ermöglicht Durchblättern historischer Daten ohne Zeitspanne zu ändern
- Beispiel: Bei "7 Days" und Februar-Anzeige verschiebt ← den Bereich zu Januar
- Beispiel: Bei "2 Weeks" verschiebt ← den Bereich um 2 Wochen zurück
- Technisch: Time range calculation in applyFilters() erweitert um Offset-Anwendung
- Technisch: Offset multipliziert mit timespanValue für alle Units (hours, days, weeks, months)

### Version 1.7.9 (2026-01-21) - ENTFERNT in 1.7.19
- **ZURÜCKGEZOGEN:** F-1.5.1 - Zähler-Vorausfüllung wurde komplett entfernt
- Funktion wurde als störend empfunden - Vorausfüllung war verwirrend
- Neue Verhaltensweise (ab 1.7.19): Zähler starten IMMER bei 0
- Siehe Version 1.7.19 für Details zur Entfernung

### Version 1.7.8 (2026-01-21)
- Funktion: F-4.12.3 - Intelligente X-Achsen-Beschriftung implementiert
- Funktion: Neue calculateLabelInterval() Funktion berechnet optimale Label-Intervalle basierend auf verfügbarem Platz
- Funktion: Automatisches Überspringen von Labels wenn Chart-Breite zu klein ist (verhindert Überlappung)
- Funktion: Algorithmus berücksichtigt Chart-Breite, Label-Anzahl, Label-Länge und Font-Größe
- Verbesserung: Gruppierte Balkendiagramme zeigen jetzt nur jeden N-ten Label bei vielen Datenpunkten
- Verbesserung: Multi-Linien-Diagramme zeigen jetzt nur jeden N-ten Label bei vielen Datenpunkten
- Verbesserung: Erweitert bestehende Auto-Step-Size-Logik um X-Achsen-Spacing
- Test: 15 automatisierte Tests für Label-Spacing-Logik (Browser-basiert)
- Test: Test-Suite unter public/test-label-spacing.html verfügbar
- Test: Real-world Szenarien getestet (2 Wochen Stundendaten, 1 Monat Tagesdaten, etc.)
- Wartbarkeit: calculateLabelInterval() als exportierte Funktion testbar und wiederverwendbar
- UX: Bessere Lesbarkeit von Diagrammen mit vielen Zeitschritten (z.B. stündliche Daten über mehrere Tage)

### Version 1.7.7 (2026-01-17)
- Bugfix: Letzter Type in Types-Sektion wurde beim Import verloren
- Bugfix: Beim Wechsel von "Types:" zu "Details:" Sektion wird currentType jetzt gespeichert
- Fix: Configuration Import erstellt jetzt alle Types korrekt (Party Type wurde übersprungen)

### Version 1.7.6 (2026-01-17)
- Debug: Umfassendes Console-Logging für Configuration Import hinzugefügt
- Debug: Trackt Parsing von Types und Details, Creation/Update Prozesse
- Debug: Zeigt Fehler bei Type/Detail Lookup und Creation an
- Bugfix: Diagnose-Tools für Configuration Import Probleme

### Version 1.7.5 (2026-01-17)
- Design: Einheitliche Abstände zwischen allen Chart-Controls
- Design: .chart-controls gap reduziert von var(--spacing-md) auf var(--spacing-sm)
- Design: .control-buttons gap erhöht von var(--spacing-xs) auf var(--spacing-sm)
- Design: .control-label padding-top angepasst von 8px auf 6px für bessere Ausrichtung
- UX: Konsistente 16px (1rem) Abstände vertikal zwischen allen Elementen
- UX: Kompaktere, aufgeräumtere Darstellung ohne sichtbare Unterschiede in den Gaps

### Version 1.7.4 (2026-01-17)
- UX: Step Size und Counter Axis jetzt auch im Grid-Layout mit Labels links
- UX: Auto Step Size Checkbox zeigt "Auto" statt "Auto Step Size"
- Design: Alle Controls nutzen konsistentes .control-row Layout
- Design: Manual Step Size Select erscheint unter Auto-Checkbox wenn deaktiviert
- JavaScript: Toggle-Logik aktualisiert von manual-step-group zu manual-step-size Element
- Konsistenz: Alle 4 Haupt-Controls (Time Span, Chart Type, Step Size, Counter Axis) gleich formatiert

### Version 1.7.3 (2026-01-17)
- UX: Labels "Time Span" und "Chart Type" jetzt links von den Buttons
- UX: Buttons der einzelnen Settings vertikal ausgerichtet
- Design: Neues Grid-Layout mit .control-row für konsistente Ausrichtung
- Design: grid-template-columns: 120px 1fr für Label + Buttons
- Design: .control-label für Labels links, .control-buttons für Button-Container
- Design: Vertikale Stapelung der Button-Gruppen innerhalb jedes Settings
- Layout: Alle Button-Gruppen links-aligned für einheitliches Erscheinungsbild

### Version 1.7.2 (2026-01-17)
- UX: Time Span Control jetzt auf zwei Zeilen aufgeteilt
- UX: Erste Zeile: Unit-Selector (Hours/Days/Weeks/Months)
- UX: Zweite Zeile: Value-Counter (+/- für Anzahl)
- Design: Neue .control-group-vertical CSS-Klasse für vertikales Layout
- Design: flex-direction: column und align-items: flex-start für Time Span
- Mobile: Bessere Übersicht durch vertikale Anordnung

### Version 1.7.1 (2026-01-17)
- Bugfix: Chart-Controls auf Mobilgeräten teilweise außerhalb des Viewports
- Responsive: @media (max-width: 768px) für Chart-Controls hinzugefügt
- Responsive: Controls stapeln sich vertikal auf schmalen Bildschirmen
- Responsive: control-group nutzt width: 100% und justify-content: space-between
- UX: Alle Buttons jetzt auf Smartphone sichtbar und erreichbar
- Mobile: Verbesserte Touch-Bedienung durch vollbreite Control-Groups

### Version 1.7.0 (2026-01-17)
- UX: Detail-Filter jetzt vertikal angeordnet mit ausgerichteten Checkboxen
- UX: Verbesserte Lesbarkeit und Übersicht bei vielen Details
- Design: #filter-details verwendet flex-direction: column für vertikales Layout
- Design: Checkboxen links-aligned mit gap: var(--spacing-xs) für einheitlichen Abstand
- Design: flex-shrink: 0 auf Checkboxen verhindert Größenänderung

### Version 1.6.9 (2026-01-17)
- UX: Chart-Controls nach oben verschoben - direkt unter Diagramm statt in Filter-Sektion
- UX: Time Span nutzt jetzt +/- Buttons statt Dropdowns (Unit und Value separat steuerbar)
- UX: Chart Type nutzt jetzt ◀/▶ Buttons zum Durchschalten (Bar/Line/Pie)
- UX: Verbesserte Touch-Bedienbarkeit mit großen Counter-Buttons (36px)
- UX: Übersichtlichere Anordnung der wichtigsten Controls direkt am Chart
- Design: Neue .chart-controls Sektion mit Flexbox-Layout
- Design: .btn-counter und .counter-display Styles für einheitliches Look & Feel
- Design: Visuelle Gruppierung durch .btn-counter-group Container
- Funktion: Counter-Buttons mit Hover-Effekten und Scale-Animation
- Wartbarkeit: Hidden inputs behalten Kompatibilität mit bestehender Filter-Logik

### Version 1.6.8 (2026-01-17)
- Bugfix: CSV-Import ignorierte Timestamps - verwendete createEntry() statt createEntryWithTimestamp()
- Bugfix: Importierte Einträge bekamen alle den aktuellen Zeitstempel statt den aus der CSV-Datei
- Bugfix: Alle importierten Daten erschienen auf dem letzten Tag statt über Zeitbereich verteilt
- Verbesserung: CSV-Import nutzt jetzt createEntryWithTimestamp() und übergibt timestamp-Parameter
- Verbesserung: Importierte Test-Daten behalten jetzt ihre Original-Zeitstempel aus CSV
- Known Issue: Mögliches Problem mit Import-Funktion oder Entry-Zählung - erfordert weitere Untersuchung
- Known Issue: Nach Import zeigen sich möglicherweise nicht alle Einträge korrekt in Aggregation - Root Cause noch zu ermitteln

### Version 1.6.7 (2026-01-17)
- Bugfix: Behoben "Invalid Date" Fehler durch fehlerhafte setUTCDate() Mutation
- Bugfix: Zeit-Berechnung nutzt jetzt Date.UTC() Konstruktor statt gefährlicher Mutationen
- Bugfix: Vermeidet invalide Zwischenzustände bei Monatsüberschreitungen
- Verbesserung: Robuste Datums-Berechnung für alle Edge Cases (Schaltjahre, Monatsgrenzen, Jahreswechsel)
- Test: Neue umfassende Test-Suite TEST_time_calculations.html mit 30+ Tests
- Test: Abdeckung aller Corner Cases: Schaltjahre (auch Jahrhundert-Regel), Monatsgrenzen, Jahreswechsel, DST, Null-Werte
- Test: Validierung für Feb 29 in Schaltjahren (2024, 2000) und Nicht-Schaltjahren (2100)
- Test: Grenzfälle wie Mitternacht UTC, End-of-Day, sehr große Zeitspannen (365 Tage)
- Wartbarkeit: Date.UTC() garantiert valide Dates ohne RangeError Risiko
- Qualität: Zero-Tolerance für "Invalid time value" Fehler durch systematische Tests

### Version 1.6.6 (2026-01-17)
- Bugfix: F-4.13.1 - Behoben kritischer Timezone-Bug bei Zeit-Aggregation, der alle Daten auf dem letzten Tag aggregierte
- Bugfix: Zeit-Schritte werden jetzt mit UTC-Methoden generiert statt lokaler Zeit (setUTCDate, setUTCHours, etc.)
- Bugfix: Zeitspannen-Berechnung (startTime/endTime) verwendet jetzt UTC-Methoden für konsistente Aggregation
- Bugfix: Schritt-Labels (formatStepLabel) verwenden UTC-Methoden für korrekte Datumsanzeige
- Verbesserung: Diagramm-Aggregation funktioniert jetzt korrekt unabhängig von Browser-Timezone
- Verbesserung: 14-Tage-Zeitspanne zeigt jetzt korrekt 14 separate Tages-Balken statt eines einzelnen Balkens
- Verbesserung: Versionsnummer zentralisiert in version.js - nur eine Stelle für alle Updates
- Funktion: setupAboutPage() injiziert Version dynamisch in About-Seite aus APP_VERSION Konstante
- Funktion: Service Worker Cache-Name verwendet dynamische Versionsnummer (`life-logger-v${APP_VERSION}`)
- Technisch: Alle Datum/Zeit-Operationen in Aggregations-Pipeline nutzen UTC für Konsistenz mit ISO 8601 Timestamps in IndexedDB
- Technisch: Neue version.js als Single Source of Truth für APP_VERSION
- Technisch: Service Worker nutzt importScripts() um version.js zu laden
- Wartbarkeit: Version muss nur noch an einer Stelle (version.js) aktualisiert werden

### Version 1.6.5 (2026-01-16)
- Bugfix: Zeitspannen-Aggregation startet jetzt konsistent bei Mitternacht (00:00:00) für Tages/Wochen/Monats-Zeiträume
- Bugfix: Fixed endTime mutation problem in aggregateByTimeSteps durch lokale Date-Kopie
- Verbesserung: Tages-Labels in Diagrammen zeigen jetzt Datum + Wochentag (z.B. "Jan 2 Mon") für bessere Orientierung
- Verbesserung: Konsistentere Zeit-Aggregation durch normalisierte Start-Zeitpunkte

### Version 1.6.4 (2026-01-16)
- Funktion: Implementiert Konfiguration-Export in menschen-lesbarem Text-Format
- Funktion: Konfiguration wird mit hierarchischer Struktur durch Einrückung (2/4/6 Leerzeichen) gespeichert
- Funktion: Typen-Namen, Icons und Farben in Listenform mit lesbarem Format
- Funktion: Details gruppiert nach Typen mit Icons, Farben und Einheiten
- Funktion: Implementiert Konfiguration-Import mit Update bestehender Einträge
- Funktion: Import erkennt automatisch bestehende Typen/Details und aktualisiert diese
- Funktion: Neue configService.js für Export/Import-Logik
- UX: Export/Import-Buttons in Settings-Seite integriert
- Format: Dateiformat .txt für maximale Lesbarkeit und Editierbarkeit

### Version 1.6.3 (2026-01-16)
- Fix: F-2.2 GPS-Erfassung implementiert - GPS-Koordinaten werden nun bei Entry-Erstellung automatisch erfasst
- Funktion: GPS-Daten (latitude, longitude, accuracy) werden in IndexedDB und CSV-Export gespeichert
- Technisch: navigator.geolocation mit 5s Timeout, 1min Cache, graceful degradation bei fehlender GPS-Berechtigung

### Version 1.6.2 (2026-01-16)
- Verbesserung: F-2.1.1 erweitert - Zeitstempel-Anpassung setzt Counter automatisch auf 1 wenn Counter=0
- UX: Verhindert versehentliches Erstellen von Einträgen mit Count=0 bei Zeitstempel-Anpassung
- Fix: Counter-Anpassung erfolgt nur beim Apply der Zeitstempel-Änderung, nicht beim Öffnen des Dialogs

### Version 1.6.1 (2026-01-16)
- Funktion: Implementiert About-Seite mit Version und Key Features
- Funktion: About-Seite zeigt aktuelle Version (1.6) prominent an
- Funktion: Key Features in changelog-ähnlichem Stil gruppiert (Core, Visualization, Data Management, UX)
- Verbesserung: Navigation erweitert um About-Tab
- Fix: CSV-Export enthält nun GPS-Location-Daten (latitude, longitude, accuracy)
- Fix: CSV-Import verarbeitet Location-Spalten korrekt

### Version 1.6 (2026-01-16)
- Funktion: Implementiert Counter-Achsen-Modus-Umschaltung (Y-Achse vs X-Achse)
- Funktion: Implementiert Y-Achsen-Modus mit zeitbasierter Aggregation (Counter vertikal, Zeit horizontal)
- Funktion: Implementiert X-Achsen-Modus mit item-basierter Aggregation (Counter horizontal, Items vertikal, keine Zeit)
- Funktion: Implementiert aggregateByItems() für zeitlose Gesamt-Aggregation
- Funktion: Implementiert renderHorizontalBarChart() für horizontale Balkendiagramme im X-Modus
- Funktion: Linien-Diagramme nur im Y-Modus verfügbar (erfordert Zeit-Dimension)
- Verbesserung: Apply-Button entfernt - alle Filter-Änderungen werden sofort angewendet (instant updates)
- Verbesserung: Event-Listener auf allen Filter-Controls für sofortige Aktualisierung
- Verbesserung: Achsen-Toggle als Button statt Dropdown für bessere Bedienbarkeit
- Verbesserung: Achsen-Modus in LocalStorage persistiert
- Verbesserung: Automatische Chart-Typ-Auswahl basierend auf Achsen-Modus (vertikal vs horizontal)
- UX: Sofortiges visuelles Feedback bei allen View-Einstellungsänderungen

### Version 1.4 (2026-01-16)
- Funktion: Implementiert zeitbasierte Schrittgrößen für Diagramme (1h, 6h, 1 Tag, 1 Woche, 1 Monat)
- Funktion: Implementiert automatische Schrittgröße basierend auf Zeitspanne
- Funktion: Implementiert manuelle Schrittgröße-Auswahl mit Auto-Modus-Toggle
- Funktion: Implementiert Achsenausrichtung-Umschaltung (horizontal/vertikal)
- Funktion: Implementiert gruppierte Balkendiagramme für mehrere Items pro Zeitschritt
- Funktion: Implementiert Multi-Linien-Diagramme mit farblich distinkten Linien pro Item
- Funktion: Implementiert Wochentags-Abkürzungen für Zeitachsen (Mon, Tue, etc.)
- Funktion: View-Einstellungen in LocalStorage gespeichert (persistiert über Sessions)
- Verbesserung: Diagramm-Position verschoben nach oben (vor Filtern)
- Verbesserung: Zeitbasierte Aggregation ermöglicht detaillierte Trend-Analyse

### Version 1.3 (2026-01-15)
- Funktion: Implementiert Edit-Dialog für Detail Icon und Farbe im Konfigurationsmodus
- Funktion: Implementiert Live-Vorschau im Edit-Dialog
- Funktion: Implementiert klickbare Detail-Icons im Konfigurationsmodus
- Funktion: Implementiert Detail-basierte Diagramm-Aggregation
- Funktion: Implementiert Radio-Button-Auswahl zwischen Typ/Detail-Aggregation
- Funktion: Implementiert Select All/Deselect All Buttons für Detail-Auswahl
- Funktion: Implementiert gruppierte Detail-Checkboxen nach Typ
- Bugfix: Behoben Android Touch-Events die Klicks abbrechen (10px Bewegungs-Schwellwert)
- Bugfix: Behoben Service Worker Pfad-Probleme in Subfolder-Deployment (absolute → relative Pfade)
- Bugfix: Behoben Service Worker Cache-Blockierung durch Promise.allSettled
- Verbesserung: Service Worker v7 mit network-first Strategie für kritische Dateien
- Verbesserung: Vereinheitlichte Diagnostik-Oberfläche mit Geräte-spezifischen Anleitungen
- Verbesserung: TEST_ Dateien konsolidiert in diagnostic.html mit isolierten Tests

### Version 1.2 (2026-01-13)
- Funktion: Implementiert Zeitstempel-Anpassungs-Dialog mit inkrementellen Intervallen
- Funktion: Implementiert Vorzeichen-Umschaltung für Zeit-Addition/Subtraktion
- Funktion: Implementiert Glow-Effekt am Uhr-Icon bei angepasstem Zeitstempel
- Funktion: Implementiert Checkboxen in Detail-Zeilen im Konfigurationsmodus
- Funktion: Implementiert "Move [Typname]" Button für Bulk-Detail-Verschiebung
- Funktion: Implementiert "Delete Checked" Button für Bulk-Detail-Löschung
- Funktion: Implementiert Move-Dialog zur Auswahl des Ziel-Typs
- Funktion: Implementiert Detail-Verschiebung mit History-Erhalt
- Funktion: Implementiert Fixed Positioning für Typ-Management-Buttons (60px vom unteren Rand)
- Verbesserung: Typ-Management-Buttons bleiben sichtbar unabhängig von Typ-Anzahl
- Verbesserung: Checkboxen-Auswahl aktiviert/deaktiviert Move- und Delete-Buttons dynamisch

### Version 1.1 (2026-01-12)
- Funktion: Implementiert benutzerdefinierte Einheiten pro Eintrag (nicht pro Detail)
- Funktion: Implementiert "Add [Typ]" Buttons unter Typ-Kacheln
- Funktion: Implementiert Long-Press Info-Popup für Typen
- Funktion: Implementiert erweiterte Mood-Details (Neutral, Angry, Frightened)
- Funktion: Implementiert optimiertes Mobile-Layout (Zähler-Buttons zentriert)
- Funktion: Implementiert Pulsing-Glow-Animation nach Commit
- Änderung: Entfernt Zusammenfassungsvorschau (Benutzerpräferenz)
- Änderung: Geändert "Log Entry" zu "Commit Log" mit deaktiviertem Zustand
- Änderung: Aktualisiert CSV-Format um benutzerdefinierte Einheiten einzuschließen

### Version 1.0 (Initial MVP)
- Funktion: Kern-Logging-Funktionalität
- Funktion: IndexedDB-Speicherung
- Funktion: CSV-Export/Import
- Funktion: Basis-Diagramme
- Funktion: Einstellungs-Seite
- Funktion: PWA-Unterstützung

---

**Gepflegt von:** Claude (Anthropic)
**Zuletzt Aktualisiert:** 2026-01-30
**Aktuelle Version:** 1.7.25
**Status:** MVP Komplett & Produktionsbereit
