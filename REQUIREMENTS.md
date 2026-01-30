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
| No   | F-1.5.1   | Kerndateneingabe & Speicherung               | **ENTFERNT:** Zähler-Felder starten IMMER bei 0 beim Auswählen eines Typs. Werte werden NICHT vorausgefüllt. Änderungen gehen verloren bei Zurück-Button oder Verlassen der Log-Ansicht. Nur "Commit Log" überträgt Werte in die Datenbank. |
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
| Yes  | F-2.1.7   | Automatischer Kontext & Anreicherung         | "Commit Log" Button im Zeitstempel-Dialog bei vorhandenem Counter >0. Kombiniert Zeitanpassung und Commit in einem Schritt.                                              |
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
| Yes  | F-4.0.4   | Datenüberprüfung & Visualisierung            | Typ-Header in Detail-Filterung anklickbar zum Umschalten aller Details eines Typs (Select/Deselect by Type).                                                            |
| Yes  | F-4.0.5   | Datenüberprüfung & Visualisierung            | Gespeicherte Filter-Presets (Aliase): Detail-Auswahl UND Darstellungseinstellungen unter einem Namen speichern/laden. Dropdown sichtbar in beider Aggregationsmodus (By Type/By Detail). Erweiterbar. Versteckt wenn leer. |
| ---  | ---       | ---                                          | ---                                                                                                                                                                      |
|      | F-4.1     | Datenüberprüfung & Visualisierung            | Zusammenfassungsvorschau vor Finalisierung. Entfernt nach Benutzerpräferenz.                                                                                             |
| Yes  | F-4.2     | Datenüberprüfung & Visualisierung            | "View" Navigations-Tab zur Datenüberprüfungsseite.                                                                                                                       |
| Yes  | F-4.3     | Datenüberprüfung & Visualisierung            | Filterung nach einem oder mehreren Typen via Checkboxen.                                                                                                                 |
| Yes  | F-4.4     | Datenüberprüfung & Visualisierung            | Filter für neueste Einträge (Standard: 24h) via Zeitspannen-Filter.                                                                                                      |
| Yes  | F-4.5     | Datenüberprüfung & Visualisierung            | Zeitspannen-Definition (Stunden/Tage/Wochen/Monate/Jahre).                                                                                                               |
| Yes  | F-4.6     | Datenüberprüfung & Visualisierung            | Zeitspannen-Auswahl via Pfeil-Buttons (ohne Minuten im MVP).                                                                                                             |
| Yes  | F-4.7     | Datenüberprüfung & Visualisierung            | Darstellungsstil-Auswahl via Dropdown.                                                                                                                                   |
| Yes  | F-4.8     | Datenüberprüfung & Visualisierung            | Standard: SVG-Balkendiagramm.                                                                                                                                            |
| Yes  | F-4.9     | Datenüberprüfung & Visualisierung            | Linien- und Kreisdiagramme als SVG verfügbar.                                                                                                                            |
|      | F-4.10    | Datenüberprüfung & Visualisierung            | Erweiterte visuelle Optionen (Hintergrund-Einfärbung, Icons/Piktogramme für Dimensionen).                                                                                |
| Yes  | F-4.11    | Datenüberprüfung & Visualisierung            | Pulsierende blaue Glow-Animation auf Typ-Kachel nach Commit (8s gesamt).                                                                                                 |
| Yes  | F-4.12    | Datenüberprüfung & Visualisierung            | Automatische Schrittgröße basierend auf Zeitspanne (1 Tag → 3h Schritte, 2-7 Tage → 1 Tag, 2-4 Wochen → KW, 2-6 Monate → Monate). Mehrzeilige Labels: Bei Stunden "15:00\n1.Jan", bei Tagen/Wochen wird Monat auf zweiter Zeile angezeigt, bei Monatswechsel beide Monate (z.B. "Mon\nJan  Feb"). |
| Yes  | F-4.12.1  | Datenüberprüfung & Visualisierung            | Manuelle Schrittgröße-Auswahl (1h, 6h, 1 Tag, 1 Woche, 1 Monat) mit Auto-Modus-Toggle.                                                                                   |
| Yes  | F-4.12.2  | Datenüberprüfung & Visualisierung            | Zeitachsen-Beschriftung zeigt Wochentags-Abkürzungen bei Tages-Schritten (Mon, Tue, etc.).                                                                               |
| Yes  | F-4.12.3  | Datenüberprüfung & Visualisierung            | Intelligente X-Achsen-Beschriftung verhindert überlappende Labels durch automatische Intervall-Berechnung basierend auf verfügbarem Platz.                                |
| Yes  | F-4.13    | Datenüberprüfung & Visualisierung            | Counter-Achsen-Modus umschaltbar via Button-Toggle (Y-Achse: zeitbasiert, X-Achse: item-basiert).                                                                        |
| Yes  | F-4.13.1  | Datenüberprüfung & Visualisierung            | Y-Achsen-Modus (Default): Counter auf Y-Achse, Zeit-Labels auf X-Achse, zeitbasierte Aggregation mit Schrittgröße.                                                       |
| Yes  | F-4.13.2  | Datenüberprüfung & Visualisierung            | X-Achsen-Modus: Counter auf X-Achse, Item-Namen auf Y-Achse, Gesamt-Aggregation ohne Zeit-Dimension.                                                                     |
| Yes  | F-4.14    | Datenüberprüfung & Visualisierung            | Filter-Änderungen werden sofort angewendet ohne Apply-Button (instant updates).                                                                                          |
| Yes  | F-4.15    | Datenüberprüfung & Visualisierung            | Diagramm-Position oben auf View-Seite (vor Filtern).                                                                                                                     |
| Yes  | F-4.16    | Datenüberprüfung & Visualisierung            | Gruppierte Balkendiagramme für mehrere Items pro Zeitschritt.                                                                                                            |
| Yes  | F-4.17    | Datenüberprüfung & Visualisierung            | Multi-Linien-Diagramme mit farblich distinkten Linien pro Item.                                                                                                          |
| Yes  | F-4.18    | Datenüberprüfung & Visualisierung            | View-Einstellungen in LocalStorage gespeichert (Chart-Typ, Schrittgröße, Achsen-Modus, Aggregation, Zeitspanne).                                                         |
| Yes  | F-4.19    | Datenüberprüfung & Visualisierung            | Aufgeteilte Steuerung: "Time Span" zeigt [Wert][Einheit] (z.B. [3][Days]), "Time Range" mit Pfeil-Buttons (← [Offset] →) zur Verschiebung des Zeitbereichs vor/zurück. Offset zeigt Anzahl der Zeitspannen-Verschiebung. |
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
| Yes  | NF-1.12.1 | Nicht-funktionale & technische Anforderungen | CSV-Import: Backward compatibility für legacy GPS-Spalten (latitude, longitude, accuracy). GPS-Daten werden ignoriert, Import-Warnung wird angezeigt.                     |
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
- Test: Intelligente X-Achsen-Label-Spacing mit 15 automatisierten Tests
- Test: Zähler-Vorausfüllung mit letzten Werten pro Detail
- Test: Zeitbereichs-Navigation mit ← → Buttons

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

Für die vollständige Versionshistorie siehe [CHANGELOG.md](CHANGELOG.md).
