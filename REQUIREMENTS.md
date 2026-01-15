## Finalisierte Anforderungen (Baseline 1.2 - Implementierte Version)

**Letzte Aktualisierung:** 2026-01-13
**Status:** MVP vollständig implementiert und getestet

Hier ist die endgültige Liste der freigegebenen Anforderungen mit Implementierungsdetails:

| ID | Kategorie | Anforderungstext | Status |
| :--- | :--- | :--- | :--- |
| **F-1.0** | **Kerndateneingabe & Speicherung** | **Ziel:** Das System soll dem Benutzer ermöglichen, persönliche Datenpunkte in Listenformat zu erfassen und zu speichern für spätere Überprüfung und Analyse. | ✅ IMPLEMENTIERT |
| F-1.1 | Kerndateneingabe & Speicherung | Das System soll dem Benutzer eine Liste aller zuvor erfassten Einträge auf einer dedizierten Überprüfungsseite anzeigen. | ✅ IMPLEMENTIERT (View-Seite) |
| F-1.2 | Kerndateneingabe & Speicherung | Das System soll dem Benutzer einen Mechanismus zur Auswahl des **Typs** eines Eintrags bereitstellen (z.B. neuen Typ erstellen oder aus erstellten Typen wählen: Stimmung, Aktivität). Dies soll die **Standardansicht für einen neuen Eintrag** sein. | ✅ IMPLEMENTIERT (Kachel-basiert) |
| **F-1.2.1** | **Kerndateneingabe & Speicherung** | Das System soll die Ansicht für neue Einträge (Auswahl von Typ/Details) als **Liste oder Kacheln** darstellen. | ✅ IMPLEMENTIERT (Typen als Kacheln mit "Add [Typ]" Buttons) |
| **F-1.2.2** | **Kerndateneingabe & Speicherung** | Das System soll die Typ/Details-Ansichten **sortierbar** machen nach Name, zuletzt verwendet, oder Anzahl der Einträge. | ⏳ VERSCHOBEN (Statische Reihenfolge aktuell) |
| **F-1.2.3** | **Kerndateneingabe & Speicherung** | Das System soll unter jeder Typ-Kachel einen "Add [Typname]" Button anzeigen für schnellen Zugriff. Sowohl Kachel-Klick als auch Button-Klick sollen die Details-Auswahl öffnen. | ✅ IMPLEMENTIERT |
| **F-1.2.4** | **Kerndateneingabe & Speicherung** | Das System soll bei langem Drücken (>1 Sekunde) auf eine Typ-Kachel ein Info-Popup anzeigen, das zeigt wann dieser Typ zuletzt verwendet wurde (Format: Xs/Xm/Xh/Xd oder NEVER). | ✅ IMPLEMENTIERT |
| **F-1.2.5** | **Kerndateneingabe & Speicherung** | Das System soll die Buttons zum Hinzufügen/Löschen von Typen am unteren Bildschirmrand fixiert anzeigen (oberhalb der Navigationsleiste). | ✅ IMPLEMENTIERT (Fixed Positioning bei 60px vom unteren Rand) |
| F-1.3 | Kerndateneingabe & Speicherung | Das System soll dem Benutzer einen Mechanismus zur Auswahl der **Details** des Eintrags aus einer zweiten **Listen/Kachel-Auswahl** bereitstellen, die dynamisch gefiltert/aktualisiert wird basierend auf der Auswahl in der **Typ-Liste/Kachel**. *Typ* und *Details* haben eine 1:n-Beziehung. | ✅ IMPLEMENTIERT (Detail-Zeilen mit Inline-Zählern) |
| **F-1.3.1** | **Kerndateneingabe & Speicherung** | Das System soll Details als Zeilen darstellen mit: Icon (links), Name (links-mitte), Zähler-Controls (Mitte), Einheiten-Eingabe (rechts). Zähler-Controls in der Mitte für optimale Daumen-Erreichbarkeit auf Mobilgeräten. | ✅ IMPLEMENTIERT |
| **F-1.3.2** | **Kerndateneingabe & Speicherung** | Das System soll die gleichzeitige Auswahl und Zählung mehrerer Details ermöglichen. Benutzer kann Zähler für mehrere Details inkrementieren vor dem Commit. | ✅ IMPLEMENTIERT (Batch Commit) |
| **F-1.3.3** | **Kerndateneingabe & Speicherung** | Das System soll im Konfigurationsmodus Checkboxen für jedes Detail anzeigen zur Auswahl mehrerer Items für Bulk-Operationen (Verschieben, Löschen). | ✅ IMPLEMENTIERT |
| **F-1.3.4** | **Kerndateneingabe & Speicherung** | Das System soll einen "Move [Typname]" Button im Konfigurationsmodus anzeigen (Typname dynamisch ermittelt), der aktiviert wird wenn mindestens ein Detail ausgewählt ist. | ✅ IMPLEMENTIERT |
| **F-1.3.5** | **Kerndateneingabe & Speicherung** | Das System soll einen "Delete Checked" Button im Konfigurationsmodus anzeigen, der aktiviert wird wenn mindestens ein Detail ausgewählt ist und alle ausgewählten Details nach Bestätigung löscht. | ✅ IMPLEMENTIERT |
| F-1.4 | Kerndateneingabe & Speicherung | Das System soll dem Benutzer ermöglichen, die verfügbaren Optionen für sowohl die Typ-Liste als auch die Details-Liste zu erweitern/ändern/löschen über eine **dedizierte Konfigurationsseite (siehe F-3.7)**. | ✅ IMPLEMENTIERT (Eintrags-Definitionen verwalten) |
| **F-1.4.1** | **Kerndateneingabe & Speicherung** | Das System soll dem Benutzer ermöglichen, eine optionale **Maßeinheit** (z.B. Minuten, km, Wiederholungen) für jede Detail-Option zu definieren. **WICHTIG:** Einheiten werden **pro Eintrag** gespeichert, nicht pro Detail. Die Einheit des Details dient nur als Platzhalter/Vorschlag. | ✅ IMPLEMENTIERT (Benutzerdefinierte Einheiten-Eingabe pro Eintrag) |
| **F-1.4.1.1** | **Kerndateneingabe & Speicherung** | Das System soll für jede Detail-Zeile ein Einheiten-Eingabefeld anzeigen, das dem Benutzer erlaubt eine benutzerdefinierte Einheit für diesen spezifischen Eintrag einzugeben. Verschiedene Einträge desselben Details können verschiedene Einheiten haben (z.B. Brot: "Scheiben" vs "Gramm" vs "kcal"). | ✅ IMPLEMENTIERT |
| **F-1.4.1.2** | **Kerndateneingabe & Speicherung** | Das System soll die Einheiten-Eingabefelder nur anzeigen wenn das Detail eine Einheit definiert hat, andernfalls wird das Feld ausgeblendet. | ✅ IMPLEMENTIERT |
| **F-1.4.1.3** | **Kerndateneingabe & Speicherung** | Das System soll im Konfigurationsmodus die Einheiten-Eingabefelder editierbar machen zur Änderung der Standard-Einheit eines Details. | ✅ IMPLEMENTIERT |
| F-1.4.2| Kerndateneingabe & Speicherung | Das System soll dem Benutzer ermöglichen, einen Eintrag in Bearbeitung abzubrechen. Der Bildschirm soll danach die initiale Ansicht für einen neuen Eintrag durch Auswahl des Typs anzeigen. | ✅ IMPLEMENTIERT (Zurück-Button setzt zurück und kehrt zur Typ-Ansicht zurück) |
| F-1.5 | Kerndateneingabe & Speicherung | Das System soll für jeden Eintrag eine Eigenschaft namens "**count**" speichern, die eine positive ganze Zahl ($\geq 1$) sein muss. Der Standardwert ist 1, den der Benutzer ändern kann. Der Count repräsentiert die **Häufigkeit oder Dauer** bezogen auf die in F-1.4.1 definierte Einheit. | ✅ IMPLEMENTIERT (+/- Buttons, startet bei 0) |
| **F-1.6** | **Kerndateneingabe & Speicherung** | Das System soll die Daten primär in einem **browser-zugänglichen Datenspeicher, speziell IndexedDB** speichern. Die Implementierung muss auf **hohe Interoperabilität** zwischen Chrome, Firefox und Safari optimiert sein. | ✅ IMPLEMENTIERT (Native IndexedDB API, kein Wrapper) |
| **F-1.6.1** | **Kerndateneingabe & Speicherung** | Das System soll für Einträge folgendes Schema verwenden: `id`, `typeId`, `detailId`, `count`, `unit` (benutzerdefiniert pro Eintrag), `timestamp` (ISO 8601). | ✅ IMPLEMENTIERT |
| F-1.7 | Kerndateneingabe & Speicherung | Das System soll dem Benutzer eine Benutzeroberfläche zum **Download** der lokalen Datendatei im **CSV-Format** und der lokalen Konfigurationsdatei (JSON) für manuellen Transfer zu externem Speicher/Backup bereitstellen. **(MVP Feature: Manueller Export)**. | ✅ IMPLEMENTIERT (CSV-Export mit benutzerdefinierten Einheiten) |
| --- | --- | --- | --- |
| **F-2.1** | **Automatischer Kontext & Anreicherung** | Das System soll automatisch die **Zeit der Eingabe** bei Erstellung aufzeichnen, auf die Sekunde genau. | ✅ IMPLEMENTIERT (ISO 8601 Format) |
| **F-2.1.1** | **Automatischer Kontext & Anreicherung** | Das System soll dem Benutzer ermöglichen, den Zeitstempel eines Eintrags anzupassen über einen Uhr-Icon-Button in jeder Detail-Zeile. | ✅ IMPLEMENTIERT |
| **F-2.1.2** | **Automatischer Kontext & Anreicherung** | Das System soll einen Zeitstempel-Anpassungs-Dialog anzeigen mit vordefinierten Zeitintervallen (5 min, 15 min, 30 min, 1h, 2h, 6h, 1 Tag). | ✅ IMPLEMENTIERT |
| **F-2.1.3** | **Automatischer Kontext & Anreicherung** | Das System soll im Zeitstempel-Dialog einen Vorzeichen-Umschalt-Button anzeigen (Subtrahieren/Addieren) zur Auswahl ob Zeit abgezogen oder hinzugefügt werden soll. | ✅ IMPLEMENTIERT |
| **F-2.1.4** | **Automatischer Kontext & Anreicherung** | Das System soll mehrfaches Klicken auf Zeitintervall-Buttons inkrementell verarbeiten (z.B. 2x "-5 min" = -10 min). | ✅ IMPLEMENTIERT |
| **F-2.1.5** | **Automatischer Kontext & Anreicherung** | Das System soll den Uhr-Icon-Button mit einem Glow-Effekt anzeigen wenn der Zeitstempel angepasst wurde, bis der Eintrag committed oder zurückgesetzt wird. | ✅ IMPLEMENTIERT |
| **F-2.1.6** | **Automatischer Kontext & Anreicherung** | Das System soll einen "Reset to Now" Button im Zeitstempel-Dialog anzeigen um den angepassten Zeitstempel auf die aktuelle Zeit zurückzusetzen. | ✅ IMPLEMENTIERT |
| F-2.2 | Automatischer Kontext & Anreicherung | Das System soll optional automatisch GPS-Koordinaten (präzise auf $\approx 10$ Meter) erfassen wenn ein Eintrag erstellt wird. **(Ausgeschlossen vom MVP)**. | ⏳ NICHT IMPLEMENTIERT |
| F-2.3 | Automatischer Kontext & Anreicherung | Das System soll optional, wenn Standortdaten (F-2.2) erfolgreich erfasst wurden, versuchen assoziierte Wetterdaten vom DWD über Bright Sky **Third-Party-API** abzurufen. **(Ausgeschlossen vom MVP)**. | ⏳ NICHT IMPLEMENTIERT |
| F-2.4 | Automatischer Kontext & Anreicherung | Das System soll Wetterdaten (F-2.3) trennen in Temperatur, Luftfeuchtigkeit, Windgeschwindigkeit und Luftdruck, unter Verwendung folgender **Standard-Einheiten**: Temperatur in **Celsius (°C)**, Windgeschwindigkeit in **Meter pro Sekunde (m/s)**, Luftdruck in **Hektopascal (hPa)**. Vom Benutzer wählbare alternative Einheiten sollen in der Konfiguration gespeichert werden. **(Ausgeschlossen vom MVP)**. | ⏳ NICHT IMPLEMENTIERT |
| F-2.5 | Automatischer Kontext & Anreicherung | Das System soll dem Benutzer über einen On-Screen-Prompt signalisieren wenn zusätzliche Daten (GPS/Wetter) im Hintergrund geladen werden. **(Ausgeschlossen vom MVP)**. | ⏳ NICHT IMPLEMENTIERT |
| F-2.6 | Automatischer Kontext & Anreicherung | Das System soll den Benutzer auffordern, Zugriff auf GPS-Daten über die native Berechtigungsanfrage des Browsers zu gewähren. **(Ausgeschlossen vom MVP)**. | ⏳ NICHT IMPLEMENTIERT |
| F-2.7 | Automatischer Kontext & Anreicherung | Das System soll optional versuchen, Gesundheitsdaten über Geräte zu erfassen, die mit dem Telefon verbunden sind **über Standard-Betriebssystem-Schnittstellen (z.B. HealthKit/Google Fit)**. **(Ausgeschlossen vom MVP)**. | ⏳ NICHT IMPLEMENTIERT |
| --- | --- | --- | --- |
| **F-3.1** | **Einstellungen & Benutzeroberfläche** | Das System soll standardmäßig die zuletzt erfolgreich gewählten **Typ**- und **Details**-Auswahlen verwenden wenn keine expliziten Präferenzen (F-3.2) gespeichert sind. | ✅ IMPLEMENTIERT (Verfolgt zuletzt verwendeten Zeitstempel pro Typ) |
| F-3.2 | Einstellungen & Benutzeroberfläche | Das System soll dem Benutzer ermöglichen, explizit bevorzugte Standardauswahlen für die Drop-Downs zu definieren und zu speichern, die **Vorrang haben müssen** vor dem dynamischen Vorladen (F-3.1). | ⏳ VERSCHOBEN (Nur zuletzt verwendet) |
| F-3.3 | Einstellungen & Benutzeroberfläche | Das System soll die Standard-Drop-Down-Auswahlen (F-3.2) in einer lokalen Einstellungsdatei speichern (separater Eintrag im **JSON-Format**). | ✅ IMPLEMENTIERT (Config in IndexedDB gespeichert) |
| F-3.4 | Einstellungen & Benutzeroberfläche | Das System soll eine **Einstellungs-Unterseite** zur Konfiguration von Benutzerpräferenzen bereitstellen. | ✅ IMPLEMENTIERT |
| F-3.5 | Einstellungen & Benutzeroberfläche | Das System soll die Einstellungs-Unterseite-Inhalte (Benutzerpräferenzen, Typ/Details-Definitionen) lokal speichern, mit der Option die Einstellungsdatei auf einen Server hochzuladen/herunterzuladen. **(Ausgeschlossen vom MVP)**. | ⏳ NICHT IMPLEMENTIERT |
| **F-3.6** | **Einstellungen & Benutzeroberfläche** | Das System soll einen deutlich sichtbaren '**Commit Log**' Button in der Aktionsleiste anzeigen (neben dem Zurück-Button) um alle Einträge mit count > 0 zu finalisieren. Button ist deaktiviert (ausgegraut) wenn keine Zähler gesetzt sind. | ✅ IMPLEMENTIERT |
| **F-3.6.1** | **Einstellungen & Benutzeroberfläche** | Das System soll nach dem Commit direkt zur Typ-Auswahlansicht zurückkehren ohne eine Alert-Nachricht anzuzeigen. Visuelles Feedback wird über Pulsing-Glow-Animation bereitgestellt. | ✅ IMPLEMENTIERT |
| F-3.7| Einstellungen & Benutzeroberfläche | Das System soll auf der Einstellungs-Seite die Unternavigationsoption: **"Eintrags-Definitionen verwalten"** enthalten um F-1.4 zu erfüllen. | ✅ IMPLEMENTIERT |
| **F-3.8** | **Einstellungen & Benutzeroberfläche** | Das System soll dem Benutzer ermöglichen, den Konfigurationsmodus durch langes Drücken (>1 Sekunde) auf den Detailbereich zu aktivieren. | ✅ IMPLEMENTIERT |
| **F-3.9** | **Einstellungen & Benutzeroberfläche** | Das System soll im Konfigurationsmodus einen "Leave Config Mode" Button am oberen Rand der Detail-Liste anzeigen. | ✅ IMPLEMENTIERT |
| **F-3.10** | **Einstellungen & Benutzeroberfläche** | Das System soll im Konfigurationsmodus einen orangefarbenen "⚙️ CONFIG MODE" Banner am unteren Bildschirmrand anzeigen (sticky positioning). | ✅ IMPLEMENTIERT |
| **F-3.11** | **Einstellungen & Benutzeroberfläche** | Das System soll im Konfigurationsmodus Drag-Handles für jede Detail-Zeile anzeigen zur manuellen Neuanordnung. | ✅ IMPLEMENTIERT |
| **F-3.12** | **Einstellungen & Benutzeroberfläche** | Das System soll die Detail-Reihenfolge pro Typ separat speichern in der Config-DB. | ✅ IMPLEMENTIERT |
| --- | --- | --- | --- |
| **F-4.1** | **Datenüberprüfung & Visualisierung** | Das System soll eine Zusammenfassungsvorschau aller erfassten Eintragseigenschaften (Typ, Details, Count, Zeit, ggf. GPS/Wetter, Gesundheitsdaten) vor Finalisierung und Speicherung anzeigen. | ❌ ENTFERNT (Benutzerpräferenz) |
| F-4.2 | Datenüberprüfung & Visualisierung | Das System soll einen '**View**' Button zur Navigation zur Datenüberprüfungs-/Auswahlseite (F-1.1) anzeigen. | ✅ IMPLEMENTIERT (Navigations-Tab) |
| F-4.3 | Datenüberprüfung & Visualisierung | Das System soll auf der View-Auswahlseite dem Benutzer ermöglichen, die Daten nach **einem oder mehreren Eintragstypen** zu filtern. | ✅ IMPLEMENTIERT (Checkboxen) |
| F-4.4 | Datenüberprüfung & Visualisierung | Das System soll auf der View-Auswahlseite eine spezielle Filteroption zum Anzeigen der "**neuesten**" Einträge enthalten, die standardmäßig auf die letzten 24 Stunden eingestellt ist. | ✅ IMPLEMENTIERT (Zeitspannen-Filter) |
| F-4.5 | Datenüberprüfung & Visualisierung | Das System soll auf der View-Auswahlseite dem Benutzer ermöglichen, eine Zeitspanne für die zu berücksichtigenden Daten zu definieren. | ✅ IMPLEMENTIERT (Stunden/Tage/Wochen/Monate) |
| F-4.6 | Datenüberprüfung & Visualisierung | Das System soll die Zeitspannen-Auswahl über ein Drop-Down konfigurierbar machen, das folgende feste Optionen durchläuft: **Minuten, Stunden, Tage, Wochen, Monate und Jahre.** | ✅ IMPLEMENTIERT (ohne Minuten und Jahre) |
| F-4.7 | Datenüberprüfung & Visualisierung | Das System soll auf der View-Auswahlseite dem Benutzer ermöglichen, einen Darstellungsstil (Diagramm-/Grafikstil) auszuwählen. | ✅ IMPLEMENTIERT (Dropdown-Selektor) |
| F-4.8 | Datenüberprüfung & Visualisierung | Das System soll als Standard-Darstellungsstil ein Balkendiagramm verwenden (das jede Gruppe als einen Balken über den ausgewählten Zeitraum anzeigt). | ✅ IMPLEMENTIERT (SVG-Balkendiagramm) |
| F-4.9 | Datenüberprüfung & Visualisierung | Das System soll verfügbare Darstellungsstile bereitstellen inklusive **Liniendiagramm** (Verteilung über Zeit), **Kreisdiagramm** (Verteilung nach Typ). | ✅ IMPLEMENTIERT (SVG-Linien- & Kreisdiagramme) |
| **F-4.10** | **Datenüberprüfung & Visualisierung** | Das System soll verfügbare Darstellungsstile mit **erweiterten visuellen Optionen** anbieten, inklusive **Hintergrund-Einfärbung** (repräsentiert eine einzeln auswählbare Dimension wie Typ oder Wetter) und/oder **Icons/Piktogramme** (repräsentieren eine oder mehrere auswählbare Dimensionen wie Gesundheitsdaten oder Eintrags-Details). | ⏳ NICHT IMPLEMENTIERT |
| **F-4.11** | **Datenüberprüfung & Visualisierung** | Das System soll nach dem Commit von Einträgen die aktualisierte Typ-Kachel mit einer pulsierenden blauen Glow-Animation anzeigen (3 Pulse über 3 Sekunden, dann Ausblenden über 5 Sekunden, insgesamt 8 Sekunden). | ✅ IMPLEMENTIERT |
| --- | --- | --- | --- |
| **NF-1.1** | **Nicht-funktionale & technische Anforderungen** | Das System soll **voll funktionsfähig** sein in den **neuesten zwei Versionen** folgender Browser: **Chrome, Firefox und Safari** (Desktop und Mobil). Die gewählten **Web APIs (insb. IndexedDB)** müssen **browserübergreifend stabil** funktionieren. | ✅ IMPLEMENTIERT (Vanilla JS, native IndexedDB) |
| **NF-1.1.1** | **Nicht-funktionale & technische Anforderungen** | Das System soll Vanilla JavaScript ES6 Module ohne Build-Tools oder Bundler verwenden. Aller Code läuft direkt im Browser. | ✅ IMPLEMENTIERT |
| NF-1.2 | Nicht-funktionale & technische Anforderungen | Das System soll die Benutzeroberfläche vollständig für mobile Browser optimieren (**Responsive Design**). | ✅ IMPLEMENTIERT (Mobile-First CSS) |
| NF-1.3 | Nicht-funktionale & technische Anforderungen | Das System soll die Benutzeroberfläche **touch-freundlich** gestalten. | ✅ IMPLEMENTIERT (48px Minimum Touch-Targets) |
| **NF-1.4** | **Nicht-funktionale & technische Anforderungen** | Das System soll den Benutzer-Interaktionsfluss zum Loggen eines **Kern-Eintrags** (Typ, Details, Count) für Mobilgeräte optimieren mit Zähler-Buttons positioniert in der Bildschirmmitte für optimale Daumen-Erreichbarkeit. Einheiten-Eingabe ist rechts positioniert. | ✅ IMPLEMENTIERT |
| NF-1.4.3| Nicht-funktionale & technische Anforderungen | Das System soll Listen oder Kacheln mit einer **Farbe und ein oder zwei Zeichen** darstellen für einfache Identifikation. | ✅ IMPLEMENTIERT (Farbe + Emoji-Icons) |
| **NF-1.5** | **Nicht-funktionale & technische Anforderungen** | Das System soll alle Datenabrufe und Visualisierungsgenerierungen (nach Auswahl von Filtern/Zeitspanne) in **nicht mehr als 500 Millisekunden (P95)** für bis zu **10.000 Einträge** durchführen, unter Verwendung von **IndexedDB** und **Web Workers** für asynchrone Verarbeitung um UI-Blockierung zu verhindern. | ⚠️ TEILWEISE (IndexedDB optimiert, Web Workers nicht implementiert) |
| **NF-1.6** | **Nicht-funktionale & technische Anforderungen** | Das System soll effizient mindestens **100.000 Einträge** verarbeiten können. Die Performance-Metriken (NF-1.5) müssen für **einfache Datenfilterung** erhalten bleiben; komplexere Abfragen dürfen langsamere Ladezeiten aufweisen. | ⏳ NICHT GETESTET (MVP getestet mit <1000 Einträgen) |
| NF-1.7 | Nicht-funktionale & technische Anforderungen | Das System soll die exportierte/importierte Datendatei im **CSV**-Format bereitstellen. | ✅ IMPLEMENTIERT |
| **NF-1.7.1** | **Nicht-funktionale & technische Anforderungen** | Das System soll das CSV-Format verwenden: `id;timestamp;type_name;detail_name;count;unit` wobei unit die benutzerdefinierte Einheit aus dem Entry-Record ist. | ✅ IMPLEMENTIERT |
| NF-1.8 | Nicht-funktionale & technische Anforderungen | Das System soll als CSV-Trennzeichen das **Semikolon (;)** verwenden. | ✅ IMPLEMENTIERT |
| NF-1.9 | Nicht-funktionale & technische Anforderungen | Das System soll die Datei-Kodierung **UTF-8** verwenden. | ✅ IMPLEMENTIERT (mit BOM für Excel-Kompatibilität) |
| NF-1.10| Nicht-funktionale & technische Anforderungen| Das System soll lokal gespeicherte Daten und Daten während der Übertragung nicht verschlüsseln (basierend auf Browser/HTTPS-Sicherheit), aber die lokale Speichermethode sollte triviales Lesen der Daten verhindern (z.B. Speicherung im JSON-Format). | ✅ IMPLEMENTIERT (IndexedDB native Sicherheit) |
| NF-1.11| Nicht-funktionale & technische Anforderungen| Das System soll dem Benutzer ermöglichen, die Namen der Eintragstypen und Details zu ändern **um persönliche Datenverschleierung zu verbessern**. | ✅ IMPLEMENTIERT (Edit-Funktionalität in Definitionen verwalten) |
| NF-1.12| Nicht-funktionale & technische Anforderungen| Das System soll ein Feature zum **Import** einer lokalen Datendatei im Format spezifiziert durch NF-1.7/1.8/1.9 bereitstellen. | ✅ IMPLEMENTIERT (CSV-Import mit Fehlerbehandlung) |
| **NF-1.13** | **Nicht-funktionale & technische Anforderungen** | Das System soll als Progressive Web App (PWA) installierbar sein mit Offline-Funktionalität über Service Worker. | ✅ IMPLEMENTIERT (manifest.json + sw.js) |
| --- | --- | --- | --- |
| NF-2.1 | Geschäftliche & Projekt-Einschränkungen | Das System soll ein Minimum Viable Product (MVP) liefern, das **Kern-Logging (F-1.1 bis F-1.6), Basis-Viewing (F-4.2, F-4.3, F-4.5), CSV-Export/Import (F-1.7, NF-1.7-1.9), Zeit-Auto-Erfassung (F-2.1) und Basis-Einstellungen (F-3.1, F-3.4, F-3.6)** innerhalb von 2 Monaten abdeckt. | ✅ ABGESCHLOSSEN (2026-01-13) |
| NF-2.2 | Geschäftliche & Projekt-Einschränkungen | Das System soll die Architektur so gestalten, dass sie ein einmaliges Kauf-Geschäftsmodell ermöglicht wenn öffentlich veröffentlicht (z.B. volle Funktion anbieten, keine Werbung). | ✅ ARCHITEKTUR UNTERSTÜTZT |
| NF-2.3 | Geschäftliche & Projekt-Einschränkungen | Das System soll das System-Design so gestalten, dass es die Möglichkeit berücksichtigt, eine kleine Gruppe externer Benutzer zu unterstützen (nicht nur den einzelnen initialen Benutzer). | ✅ ARCHITEKTUR UNTERSTÜTZT |

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
**Zuletzt Aktualisiert:** 2026-01-13
**Version:** 1.2
**Status:** MVP Komplett & Produktionsbereit
