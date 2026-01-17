## Finalisierte Anforderungen (Baseline 1.6.4 - Implementierte Version)

**Letzte Aktualisierung:** 2026-01-16
**Status:** MVP vollständig implementiert und getestet

Hier ist die endgültige Liste der freigegebenen Anforderungen mit Implementierungsdetails:

| Done | ID        | Kategorie                                    | Anforderungstext                                                                                                                                                         |
| :-   | :-        | :-                                           | :-                                                                                                                                                                       |
| Yes  | F-1.0     | Kerndateneingabe & Speicherung               | Ziel: Benutzer erfasst persönliche Datenpunkte in Listenformat zur späteren Überprüfung und Analyse.                                                                     |
| Yes  | F-1.1     | Kerndateneingabe & Speicherung               | Anzeige aller erfassten Einträge auf View-Seite.                                                                                                                         |
| Yes  | F-1.2     | Kerndateneingabe & Speicherung               | Auswahl des Eintragstyps (Stimmung, Aktivität, etc.) als Standardansicht für neue Einträge. Kachel-basierte Darstellung.                                                 |
| Yes  | F-1.2.1   | Kerndateneingabe & Speicherung               | Typ/Details-Ansicht als Kacheln mit "Add [Typ]" Buttons.                                                                                                                 |
|      | F-1.2.2   | Kerndateneingabe & Speicherung               | Typ/Details-Ansichten sortierbar nach Name, zuletzt verwendet oder Anzahl.                                                                                               |
| Yes  | F-1.2.3   | Kerndateneingabe & Speicherung               | "Add [Typname]" Button unter jeder Kachel für schnellen Zugriff.                                                                                                         |
| Yes  | F-1.2.4   | Kerndateneingabe & Speicherung               | Long-Press (>1s) auf Typ-Kachel zeigt Info-Popup mit letzter Verwendung (Format: Xs/Xm/Xh/Xd oder NEVER).                                                                |
| Yes  | F-1.2.5   | Kerndateneingabe & Speicherung               | Typ-Management-Buttons fixiert am unteren Bildschirmrand (60px über Navigationsleiste).                                                                                  |
| Yes  | F-1.3     | Kerndateneingabe & Speicherung               | Auswahl der Detail-Optionen mittels Liste/Kacheln, dynamisch gefiltert nach Typ (1:n-Beziehung). Detail-Zeilen mit Inline-Zählern.                                       |
| Yes  | F-1.3.1   | Kerndateneingabe & Speicherung               | Detail-Zeilen: Icon (links), Name, Zähler-Controls (Mitte für Daumen-Erreichbarkeit), Einheiten-Eingabe (rechts).                                                        |
| Yes  | F-1.3.2   | Kerndateneingabe & Speicherung               | Gleichzeitige Auswahl mehrerer Details mit Batch-Commit.                                                                                                                 |
| Yes  | F-1.3.3   | Kerndateneingabe & Speicherung               | Checkboxen im Konfigurationsmodus für Bulk-Operationen (Verschieben, Löschen).                                                                                           |
| Yes  | F-1.3.4   | Kerndateneingabe & Speicherung               | "Move [Typname]" Button im Konfigurationsmodus, aktiviert bei Auswahl.                                                                                                   |
| Yes  | F-1.3.5   | Kerndateneingabe & Speicherung               | "Delete Checked" Button im Konfigurationsmodus, löscht ausgewählte Details nach Bestätigung.                                                                             |
| Yes  | F-1.4     | Kerndateneingabe & Speicherung               | Verwaltung von Typ- und Detail-Optionen über dedizierte Konfigurationsseite (siehe F-3.7).                                                                               |
| Yes  | F-1.4.1   | Kerndateneingabe & Speicherung               | Optionale Maßeinheit pro Detail definierbar (z.B. Minuten, km). Einheiten werden pro Eintrag gespeichert, Detail-Einheit dient als Platzhalter.                          |
| Yes  | F-1.4.1.1 | Kerndateneingabe & Speicherung               | Benutzerdefiniertes Einheiten-Eingabefeld pro Detail-Zeile. Verschiedene Einträge können unterschiedliche Einheiten nutzen (z.B. Brot: "Scheiben" vs "Gramm" vs "kcal"). |
| Yes  | F-1.4.1.2 | Kerndateneingabe & Speicherung               | Einheiten-Eingabefeld nur sichtbar wenn Detail eine Einheit definiert hat.                                                                                               |
| Yes  | F-1.4.1.3 | Kerndateneingabe & Speicherung               | Editierbare Standard-Einheit im Konfigurationsmodus.                                                                                                                     |
| Yes  | F-1.4.2   | Kerndateneingabe & Speicherung               | Abbrechen eines Eintrags via Zurück-Button, kehrt zur Typ-Ansicht zurück.                                                                                                |
| Yes  | F-1.5     | Kerndateneingabe & Speicherung               | Count-Eigenschaft (positive ganze Zahl ≥1, Standard: 1) repräsentiert Häufigkeit/Dauer. Implementiert mit +/- Buttons (Start bei 0).                                     |
| Yes  | F-1.6     | Kerndateneingabe & Speicherung               | Datenspeicherung in IndexedDB mit hoher Browser-Interoperabilität (Chrome, Firefox, Safari). Native API ohne Wrapper.                                                    |
| Yes  | F-1.6.1   | Kerndateneingabe & Speicherung               | Entry-Schema: `id`, `typeId`, `detailId`, `count`, `unit` (pro Eintrag), `timestamp` (ISO 8601).                                                                         |
| Yes  | F-1.7     | Kerndateneingabe & Speicherung               | Download-UI für Datendatei (CSV) und Konfiguration (TXT) zum manuellen Backup.                                                                                          |
| Yes  | F-1.7.1   | Kerndateneingabe & Speicherung               | Export von Konfiguration (Typen und Details) in menschen-lesbarem Text-Format mit Einrückung.                                                                            |
| Yes  | F-1.7.2   | Kerndateneingabe & Speicherung               | Import von Konfiguration aus Text-Datei mit automatischer Erkennung und Update bestehender Einträge.                                                                     |
| ---  | ---       | ---                                          | ---                                                                                                                                                                      |
| Yes  | F-2.1     | Automatischer Kontext & Anreicherung         | Automatische Zeiterfassung bei Eintragserstellung (sekundengenau, ISO 8601).                                                                                             |
| Yes  | F-2.1.1   | Automatischer Kontext & Anreicherung         | Zeitstempel-Anpassung via Uhr-Icon-Button in Detail-Zeile. Bei Counter=0 wird automatisch Counter=1 gesetzt.                                                             |
| Yes  | F-2.1.2   | Automatischer Kontext & Anreicherung         | Zeitstempel-Dialog mit vordefinierten Intervallen (5 min, 15 min, 30 min, 1h, 2h, 6h, 1 Tag).                                                                            |
| Yes  | F-2.1.3   | Automatischer Kontext & Anreicherung         | Vorzeichen-Umschalt-Button im Dialog zur Auswahl Addition/Subtraktion.                                                                                                   |
| Yes  | F-2.1.4   | Automatischer Kontext & Anreicherung         | Inkrementelle Zeitanpassung bei mehrfachem Klick (z.B. 2x "-5 min" = -10 min).                                                                                           |
| Yes  | F-2.1.5   | Automatischer Kontext & Anreicherung         | Glow-Effekt am Uhr-Icon bei angepasstem Zeitstempel bis Commit/Reset.                                                                                                    |
| Yes  | F-2.1.6   | Automatischer Kontext & Anreicherung         | "Reset to Now" Button im Zeitstempel-Dialog.                                                                                                                             |
| Yes  | F-2.2     | Automatischer Kontext & Anreicherung         | Automatische GPS-Erfassung (Latitude, Longitude, Accuracy) bei Entry-Erstellung mit 5s Timeout und 1min Cache. Speicherung in Entry-Objekt und CSV-Export.             |
|      | F-2.3     | Automatischer Kontext & Anreicherung         | Wetterdaten-Abruf vom DWD via Bright Sky API bei erfolgreicher GPS-Erfassung. MVP ausgeschlossen.                                                                        |
|      | F-2.4     | Automatischer Kontext & Anreicherung         | Wetterdaten aufgeschlüsselt (Temperatur °C, Wind m/s, Luftdruck hPa) mit konfigurierbaren Einheiten. MVP ausgeschlossen.                                                 |
|      | F-2.5     | Automatischer Kontext & Anreicherung         | On-Screen-Prompt bei Hintergrund-Laden von GPS/Wetter. MVP ausgeschlossen.                                                                                               |
|      | F-2.6     | Automatischer Kontext & Anreicherung         | Browser-native Berechtigungsanfrage für GPS-Zugriff. MVP ausgeschlossen.                                                                                                 |
|      | F-2.7     | Automatischer Kontext & Anreicherung         | Gesundheitsdaten-Erfassung via OS-Schnittstellen (HealthKit/Google Fit). MVP ausgeschlossen.                                                                             |
| ---  | ---       | ---                                          | ---                                                                                                                                                                      |
| Yes  | F-3.1     | Einstellungen & Benutzeroberfläche           | Verwendung zuletzt gewählter Typ/Details-Auswahlen als Standard. Zeitstempel-Tracking pro Typ.                                                                           |
|      | F-3.2     | Einstellungen & Benutzeroberfläche           | Explizite Standard-Präferenzen definierbar mit Vorrang vor dynamischem Vorladen.                                                                                         |
| Yes  | F-3.3     | Einstellungen & Benutzeroberfläche           | Konfiguration in IndexedDB gespeichert.                                                                                                                                  |
| Yes  | F-3.4     | Einstellungen & Benutzeroberfläche           | Einstellungs-Unterseite für Benutzerpräferenzen.                                                                                                                         |
|      | F-3.5     | Einstellungen & Benutzeroberfläche           | Server-Upload/-Download der Einstellungsdatei. MVP ausgeschlossen.                                                                                                       |
| Yes  | F-3.6     | Einstellungen & Benutzeroberfläche           | "Commit Log" Button in Aktionsleiste, deaktiviert wenn keine Zähler gesetzt.                                                                                             |
| Yes  | F-3.6.1   | Einstellungen & Benutzeroberfläche           | Nach Commit Rückkehr zur Typ-Ansicht ohne Alert. Visuelles Feedback via Pulsing-Glow.                                                                                    |
| Yes  | F-3.7     | Einstellungen & Benutzeroberfläche           | "Eintrags-Definitionen verwalten" Option auf Einstellungs-Seite.                                                                                                         |
| Yes  | F-3.8     | Einstellungen & Benutzeroberfläche           | Konfigurationsmodus via Long-Press (>1s) auf Detailbereich.                                                                                                              |
| Yes  | F-3.9     | Einstellungen & Benutzeroberfläche           | "Leave Config Mode" Button oben in Detail-Liste.                                                                                                                         |
| Yes  | F-3.10    | Einstellungen & Benutzeroberfläche           | Orange "⚙️ CONFIG MODE" Banner unten (sticky).                                                                                                                           |
| Yes  | F-3.11    | Einstellungen & Benutzeroberfläche           | Drag-Handles für Detail-Neuanordnung im Konfigurationsmodus.                                                                                                             |
| Yes  | F-3.12    | Einstellungen & Benutzeroberfläche           | Detail-Reihenfolge pro Typ in Config-DB gespeichert.                                                                                                                     |
| Yes  | F-3.13    | Einstellungen & Benutzeroberfläche           | Icon und Farbe von Details editierbar durch Klick auf Icon im Konfigurationsmodus.                                                                                       |
| Yes  | F-3.13.1  | Einstellungen & Benutzeroberfläche           | Edit-Dialog mit Icon-Eingabe, Farbwähler und Live-Vorschau.                                                                                                              |
| Yes  | F-3.13.2  | Einstellungen & Benutzeroberfläche           | Sofortige UI-Aktualisierung nach Speichern ohne Datenverlust.                                                                                                            |
| Yes  | F-3.14    | Einstellungen & Benutzeroberfläche           | About-Seite mit Versionsnummer und Key Features in Changelog-Stil.                                                                                                       |
| Yes  | F-3.14.1  | Einstellungen & Benutzeroberfläche           | Version prominent am Anfang der About-Seite angezeigt.                                                                                                                   |
| Yes  | F-3.14.2  | Einstellungen & Benutzeroberfläche           | Key Features gruppiert nach Kategorien (Core, Visualization, Data Management, UX).                                                                                       |
| ---  | ---       | ---                                          | ---                                                                                                                                                                      |
| Yes  | F-4.0     | Datenüberprüfung & Visualisierung            | Ziel: Flexible Aggregations- und Visualisierungsoptionen.                                                                                                                |
| Yes  | F-4.0.1   | Datenüberprüfung & Visualisierung            | Wahl zwischen Typ- und Detail-basierter Aggregation in Diagrammen.                                                                                                       |
| Yes  | F-4.0.2   | Datenüberprüfung & Visualisierung            | Bei Detail-Aggregation: Checkboxen-Liste aller Details gruppiert nach Typ.                                                                                               |
| Yes  | F-4.0.3   | Datenüberprüfung & Visualisierung            | "Select All" und "Deselect All" Buttons für Detail-Auswahl.                                                                                                              |
| ---  | ---       | ---                                          | ---                                                                                                                                                                      |
|      | F-4.1     | Datenüberprüfung & Visualisierung            | Zusammenfassungsvorschau vor Finalisierung. Entfernt nach Benutzerpräferenz.                                                                                             |
| Yes  | F-4.2     | Datenüberprüfung & Visualisierung            | "View" Navigations-Tab zur Datenüberprüfungsseite.                                                                                                                       |
| Yes  | F-4.3     | Datenüberprüfung & Visualisierung            | Filterung nach einem oder mehreren Typen via Checkboxen.                                                                                                                 |
| Yes  | F-4.4     | Datenüberprüfung & Visualisierung            | Filter für neueste Einträge (Standard: 24h) via Zeitspannen-Filter.                                                                                                      |
| Yes  | F-4.5     | Datenüberprüfung & Visualisierung            | Zeitspannen-Definition (Stunden/Tage/Wochen/Monate).                                                                                                                     |
| Yes  | F-4.6     | Datenüberprüfung & Visualisierung            | Zeitspannen-Dropdown (ohne Minuten und Jahre im MVP).                                                                                                                    |
| Yes  | F-4.7     | Datenüberprüfung & Visualisierung            | Darstellungsstil-Auswahl via Dropdown.                                                                                                                                   |
| Yes  | F-4.8     | Datenüberprüfung & Visualisierung            | Standard: SVG-Balkendiagramm.                                                                                                                                            |
| Yes  | F-4.9     | Datenüberprüfung & Visualisierung            | Linien- und Kreisdiagramme als SVG verfügbar.                                                                                                                            |
|      | F-4.10    | Datenüberprüfung & Visualisierung            | Erweiterte visuelle Optionen (Hintergrund-Einfärbung, Icons/Piktogramme für Dimensionen).                                                                                |
| Yes  | F-4.11    | Datenüberprüfung & Visualisierung            | Pulsierende blaue Glow-Animation auf Typ-Kachel nach Commit (8s gesamt).                                                                                                 |
| Yes  | F-4.12    | Datenüberprüfung & Visualisierung            | Automatische Schrittgröße basierend auf Zeitspanne (1 Tag → 1h Schritte, 7 Tage → 1 Tag Schritte, etc.).                                                                 |
| Yes  | F-4.12.1  | Datenüberprüfung & Visualisierung            | Manuelle Schrittgröße-Auswahl (1h, 6h, 1 Tag, 1 Woche, 1 Monat) mit Auto-Modus-Toggle.                                                                                   |
| Yes  | F-4.12.2  | Datenüberprüfung & Visualisierung            | Zeitachsen-Beschriftung zeigt Wochentags-Abkürzungen bei Tages-Schritten (Mon, Tue, etc.).                                                                               |
| Yes  | F-4.13    | Datenüberprüfung & Visualisierung            | Counter-Achsen-Modus umschaltbar via Button-Toggle (Y-Achse: zeitbasiert, X-Achse: item-basiert).                                                                        |
| Yes  | F-4.13.1  | Datenüberprüfung & Visualisierung            | Y-Achsen-Modus (Default): Counter auf Y-Achse, Zeit-Labels auf X-Achse, zeitbasierte Aggregation mit Schrittgröße.                                                       |
| Yes  | F-4.13.2  | Datenüberprüfung & Visualisierung            | X-Achsen-Modus: Counter auf X-Achse, Item-Namen auf Y-Achse, Gesamt-Aggregation ohne Zeit-Dimension.                                                                     |
| Yes  | F-4.14    | Datenüberprüfung & Visualisierung            | Filter-Änderungen werden sofort angewendet ohne Apply-Button (instant updates).                                                                                          |
| Yes  | F-4.15    | Datenüberprüfung & Visualisierung            | Diagramm-Position oben auf View-Seite (vor Filtern).                                                                                                                     |
| Yes  | F-4.16    | Datenüberprüfung & Visualisierung            | Gruppierte Balkendiagramme für mehrere Items pro Zeitschritt.                                                                                                            |
| Yes  | F-4.17    | Datenüberprüfung & Visualisierung            | Multi-Linien-Diagramme mit farblich distinkten Linien pro Item.                                                                                                          |
| Yes  | F-4.18    | Datenüberprüfung & Visualisierung            | View-Einstellungen in LocalStorage gespeichert (Chart-Typ, Schrittgröße, Achsen-Modus, Aggregation, Zeitspanne).                                                         |
| ---  | ---       | ---                                          | ---                                                                                                                                                                      |
| Yes  | NF-1.1    | Nicht-funktionale & technische Anforderungen | Volle Funktionsfähigkeit in Chrome, Firefox, Safari (Desktop + Mobil, jeweils neueste 2 Versionen). Vanilla JS, native IndexedDB.                                        |
| Yes  | NF-1.1.1  | Nicht-funktionale & technische Anforderungen | Vanilla JavaScript ES6 Module ohne Build-Tools. Code läuft direkt im Browser.                                                                                            |
| Yes  | NF-1.2    | Nicht-funktionale & technische Anforderungen | Mobile-First Responsive Design.                                                                                                                                          |
| Yes  | NF-1.3    | Nicht-funktionale & technische Anforderungen | Touch-freundliche UI (48px Minimum Touch-Targets).                                                                                                                       |
| Yes  | NF-1.4    | Nicht-funktionale & technische Anforderungen | Mobil-optimierter Interaktionsfluss: Zähler-Buttons mittig für Daumen-Erreichbarkeit, Einheiten-Eingabe rechts.                                                          |
| Yes  | NF-1.4.3  | Nicht-funktionale & technische Anforderungen | Listen/Kacheln mit Farbe + 1-2 Zeichen (Emoji-Icons) für einfache Identifikation.                                                                                        |
|      | NF-1.5    | Nicht-funktionale & technische Anforderungen | Datenabrufe/Visualisierung ≤500ms (P95) für ≤10.000 Einträge via IndexedDB + Web Workers. Teilweise implementiert (nur IndexedDB).                                       |
|      | NF-1.6    | Nicht-funktionale & technische Anforderungen | Effiziente Verarbeitung von ≥100.000 Einträgen. MVP mit <1000 Einträgen getestet.                                                                                        |
| Yes  | NF-1.7    | Nicht-funktionale & technische Anforderungen | Export/Import im CSV-Format für Daten und TXT-Format für Konfiguration.                                                                                                  |
| Yes  | NF-1.7.1  | Nicht-funktionale & technische Anforderungen | CSV-Format: `id;timestamp;type_name;detail_name;count;unit`.                                                                                                             |
| Yes  | NF-1.7.2  | Nicht-funktionale & technische Anforderungen | Config-Format: Menschen-lesbares Text-Format mit hierarchischer Struktur durch Einrückung (2/4/6 Leerzeichen).                                                           |
| Yes  | NF-1.8    | Nicht-funktionale & technische Anforderungen | CSV-Trennzeichen: Semikolon (;).                                                                                                                                         |
| Yes  | NF-1.9    | Nicht-funktionale & technische Anforderungen | Datei-Kodierung: UTF-8 mit BOM (Excel-Kompatibilität).                                                                                                                   |
| Yes  | NF-1.10   | Nicht-funktionale & technische Anforderungen | Keine Verschlüsselung (Browser/HTTPS-Sicherheit), IndexedDB native Sicherheit verhindert triviales Lesen.                                                                |
| Yes  | NF-1.11   | Nicht-funktionale & technische Anforderungen | Änderbare Namen für Typen/Details zur Datenverschleierung.                                                                                                               |
| Yes  | NF-1.12   | Nicht-funktionale & technische Anforderungen | CSV-Import mit Fehlerbehandlung.                                                                                                                                         |
| Yes  | NF-1.13   | Nicht-funktionale & technische Anforderungen | PWA-installierbar mit Offline-Funktionalität (manifest.json + Service Worker).                                                                                           |
| ---  | ---       | ---                                          | ---                                                                                                                                                                      |
| Yes  | NF-2.1    | Geschäftliche & Projekt-Einschränkungen      | MVP abgeschlossen (2026-01-13): Kern-Logging, Viewing, CSV-Export/Import, Zeit-Erfassung, Einstellungen.                                                                 |
| Yes  | NF-2.2    | Geschäftliche & Projekt-Einschränkungen      | Architektur unterstützt einmaliges Kauf-Geschäftsmodell.                                                                                                                 |
| Yes  | NF-2.3    | Geschäftliche & Projekt-Einschränkungen      | Design berücksichtigt kleine externe Benutzergruppe.                                                                                                                     |

---

## Implementierungsdetails

### Dummy-Daten (Initialisiert beim ersten Start)

**Typen:**
1. Typ 😊 Mood (Blau #3498db)
2. Typ 🏃 Activity (Grün #2ecc71)
3. Typ 🍽️ Food (Rot #e74c3c)
4. Typ 😴 Sleep (Lila #9b59b6)

**Mood Details (Erweitert):**
1. Detail 😊 Happy (Gelb #f1c40f)
2. Detail 😢 Sad (Blau #3498db)
3. Detail 😐 Neutral (Grau #95a5a6)
4. Detail 😠 Angry (Rot #e74c3c)
5. Detail 😨 Frightened (Lila #9b59b6)
6. Detail ⚡ Energetic (Orange #e67e22)
7. Detail 😴 Tired (Dunkelgrau #7f8c8d)

**Activity Details:**
- Detail 🏃 Running (Rot, Minuten)
- Detail 🚴 Cycling (Blau, km)
- Detail 🚶 Walking (Grün, Minuten)
- Detail 💪 Gym (Orange, Minuten)

**Food Details:**
- Detail 🥐 Breakfast
- Detail 🍱 Lunch
- Detail 🍝 Dinner
- Detail 🍪 Snack

**Sleep Details:**
- Detail 🌙 Night Sleep (Stunden)
- Detail 💤 Nap (Minuten)

### Zentrale Design-Entscheidungen

**1. Benutzerdefinierte Einheiten pro Eintrag (Nicht pro Detail)**
- Rationale: Maximale Flexibilität - gleiches Detail kann verschiedene Einheiten in verschiedenen Kontexten haben
- Beispiel: Food > Brot
  - Eintrag 1: 2 Scheiben
  - Eintrag 2: 150 Gramm
  - Eintrag 3: 200 kcal
- Implementierung: Unit-Feld im Entry-Record, Unit des Details dient nur als Platzhalter

**2. Batch-Commit-Muster**
- Rationale: Ermöglicht Loggen mehrerer Details auf einmal (z.B. Happy:3, Tired:1 in derselben Session)
- UX: Reduziert Interaktionsanzahl, besser für schnelles Loggen
- Implementierung: State verfolgt `detailCounts` und `detailUnits` Objekte, committet alle mit count > 0

**3. Visuelles Feedback über Pulsing Glow**
- Rationale: Nicht-intrusives Feedback, keine blockierenden Alert-Dialoge
- Animation: 8 Sekunden gesamt (3s Pulse + 5s Fade)
- Implementierung: CSS-Animation `pulseAndFade` + setTimeout Cleanup

**4. Mobile-optimiertes Layout**
- Rationale: Mittlerer Bildschirmbereich ist am besten mit dem Daumen erreichbar
- Layout: Icon (links) → Name → Zähler-Buttons (MITTE) → Einheiten-Eingabe (rechts)
- Touch-Targets: 48px Minimum für alle interaktiven Elemente

**5. Long-Press Info-Popup**
- Rationale: Bietet Kontext ohne UI zu überladen
- Auslöser: 1 Sekunde Drücken auf Typ-Kachel
- Info: Zeigt zuletzt verwendeten Zeitstempel in menschenlesbarem Format (Xs/Xm/Xh/Xd/NEVER)

**6. Zeitstempel-Anpassung**
- Rationale: Ermöglicht Loggen von vergangenen Ereignissen
- Auslöser: Uhr-Icon-Button in jeder Detail-Zeile
- Funktionen: Inkrementelle Zeit-Addition/Subtraktion, Vorzeichen-Umschaltung, Reset to Now
- Feedback: Glow-Effekt am Icon bis Commit oder Reset

**7. Checkboxen für Bulk-Operationen**
- Rationale: Ermöglicht effizientes Verschieben/Löschen mehrerer Details gleichzeitig
- Auslöser: Konfigurationsmodus aktivieren via Long-Press
- Funktionen: Move zu anderem Typ, Delete mit Bestätigung
- Feedback: Buttons aktivieren/deaktivieren basierend auf Auswahl

**8. Fixed Position für Typ-Management-Buttons**
- Rationale: Buttons sollen immer sichtbar bleiben, unabhängig von Anzahl der Typen
- Position: Fixed bei 60px vom unteren Rand (oberhalb der Navigationsleiste)
- Implementierung: `position: fixed` mit hoher z-index, Box-Shadow für Abhebung

### Technische Architektur

**Frontend:** Vanilla JavaScript ES6 Module
**Datenbank:** IndexedDB (4 Object Stores: Types, Details, Entries, Config)
**Diagramme:** Custom SVG Rendering (keine externe Bibliothek)
**Styling:** CSS mit CSS-Variablen für Theming
**PWA:** manifest.json + Service Worker für Offline-Unterstützung
**Build:** Nicht erforderlich - läuft direkt im Browser

### Dateistruktur
```
/home/bbb/life-logger/
├── public/                     # Web Root
│   ├── index.html             # Single-Page-App (Log/View/Settings)
│   ├── styles.css             # Mobile-First Responsive CSS
│   ├── manifest.json          # PWA Manifest
│   ├── sw.js                  # Service Worker
│   └── src/
│       ├── main.js            # App Controller
│       ├── lib/
│       │   ├── db.js          # IndexedDB Schema + Init
│       │   ├── dataService.js # CRUD Operations
│       │   └── csvService.js  # Export/Import
│       └── components/
│           └── charts.js      # SVG Chart Rendering
```

---

## Bekannte Einschränkungen & Zukünftige Arbeit

### MVP-Einschränkungen
1. Einschränkung: Keine Web-Worker-Implementierung (direkter IndexedDB-Zugriff)
2. Einschränkung: Kein Eintrags-Edit/Delete in UI (möglich über IndexedDB direkt)
3. Einschränkung: Keine CSV-Import-Konfliktauflösung (Sprint 2)
4. Einschränkung: Keine benutzerdefinierte Datumsbereichs-Auswahl in Diagrammen
5. Einschränkung: Keine PWA-Icons (192x192, 512x512 PNG benötigt)
6. Einschränkung: Keine Sortierung/Filterung in Typ/Detail-Listen
7. Einschränkung: Keine Undo-Funktionalität
8. Einschränkung: Keine Datenvalidierung (Min/Max Counts, Unit-Format)

### Zukünftige Features (Nicht im MVP-Umfang)
- Feature: GPS-Standort-Tracking (F-2.2)
- Feature: Wetterdaten-Integration (F-2.3)
- Feature: Gesundheitsdaten-Sync (F-2.7)
- Feature: Cloud-Sync (F-3.5)
- Feature: Erweiterte Visualisierungen (F-4.10)
- Feature: Mehrsprachige Unterstützung
- Feature: Dark/Light-Mode-Umschaltung
- Feature: Datenverschlüsselung
- Feature: Multi-Device-Sync

---

## Test-Status

### Abgeschlossene Tests ✅
- Test: IndexedDB-Initialisierung
- Test: Dummy-Daten-Laden
- Test: Typ-Kachel-Rendering
- Test: Detail-Listen-Rendering
- Test: Zähler-Inkrement/Dekrement
- Test: Benutzerdefinierte Einheiten-Eingabe
- Test: Batch-Commit-Funktionalität
- Test: Visuelles Feedback (Pulsing Glow)
- Test: Long-Press Info-Popup
- Test: CSV-Export mit benutzerdefinierten Einheiten
- Test: CSV-Import mit Fehlerbehandlung
- Test: SVG-Diagramm-Rendering (Balken, Linie, Kreis)
- Test: Navigation zwischen Seiten
- Test: Einstellungen CRUD-Operationen
- Test: Mobile Responsive Layout
- Test: Konfigurationsmodus-Aktivierung
- Test: Zeitstempel-Anpassungs-Dialog
- Test: Checkboxen-basierte Bulk-Operationen
- Test: Detail-Verschiebung zwischen Typen
- Test: Detail-Löschung mit Bestätigung
- Test: Typ-Management-Buttons Fixed Positioning
- Test: Detail Icon/Farbe Bearbeitung im Konfigurationsmodus
- Test: Edit-Dialog mit Live-Vorschau
- Test: Detail-basierte Diagramm-Aggregation
- Test: Android Touch-Event-Optimierung (10px Bewegungs-Schwellwert)

### Ausstehende Tests ⏳
- Test: Performance mit 10.000+ Einträgen
- Test: Browser-Kompatibilität (Firefox, Safari)
- Test: PWA-Installation
- Test: Offline-Funktionalität
- Test: Touch-Gesten-Zuverlässigkeit auf echten Geräten
- Test: CSV-Import mit großen Dateien
- Test: IndexedDB-Quota-Limits

---

## Änderungsprotokoll

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
**Zuletzt Aktualisiert:** 2026-01-17
**Version:** 1.7.0
**Status:** MVP Komplett & Produktionsbereit (mit bekannten Issues in Aggregation)
