Hier ist das detaillierte **Element Design Concept** für die **Mobile App (Android/iOS)** der Lösung "CampusRide".

Das Konzept ist auf das **Semester-Flatrate Modell** und die Entscheidung **Option B (Strenger Betrugsschutz via GPS-Tracking)** zugeschnitten.

---

# Element Design Concept - CampusRide Mobile App

Dieses Dokument beschreibt das Design der nativen Smartphone-App, die von Studierenden (sowohl Fahrern als auch Mitfahrern) genutzt wird. Sie dient als primäre Schnittstelle zur Vermittlung, Durchführung und Validierung von Fahrten.

## Goals

Dieser Abschnitt beschreibt die Ziele, die durch die Mobile App erreicht werden sollen.

### G-01 - Verifizierte Mobilität

**Description**
Die App muss technisch sicherstellen, dass eine Fahrt tatsächlich stattgefunden hat, indem sie Geodaten von Fahrer und Mitfahrer während der Fahrt abgleicht (Option B), um den Missbrauch des solidarischen Fördertopfs zu verhindern.

### G-02 - Barrierefreier Zugang

**Description**
Die App soll den Zugang zur Plattform ausschließlich über den bestehenden Hochschul-Account ermöglichen, um eine vertrauensvolle Umgebung ("Walled Garden") ohne komplexe Registrierungsprozesse zu schaffen.

### G-03 - Datenschutzfreundliche Navigation

**Description**
Die App soll Fahrer und Mitfahrer zu "Smart Meeting Points" navigieren, anstatt private Wohnadressen anzuzeigen, um die Privatsphäre der Nutzer zu schützen.

## User Interfaces

Dieser Abschnitt beschreibt die Benutzeroberflächen der App.

### UI-01 - Dashboard & Suche

**Description**
Der Startbildschirm nach dem Login. Dient der Auswahl der Rolle (Fahrer/Mitfahrer) und der Initiierung von Fahrten.
**Actions**

* **Fahrt suchen (Passenger):** Eingabe von Start/Ziel und Zeitfenster (siehe UC-01).
* **Fahrt anbieten (Driver):** Definition einer Route und Kapazität.
* **Historie einsehen:** Anzeige vergangener Fahrten und (für Fahrer) gesammelter Credits.
**Visible Data**
* Aktuelles Guthaben/Credits (Quelle: Ledger Service).
* Liste verfügbarer Fahrten (Quelle: Backend Service).
* Status-Meldungen (z.B. "Fahrt in 30 Min").

### UI-02 - Active Ride Mode (Der Fahrt-Screen)

**Description**
Dieser Screen ist aktiv, sobald Fahrer und Mitfahrer sich getroffen haben. Er ist kritisch für Option B (Betrugsschutz).
**Actions**

* **QR-Code generieren (Passenger):** Zeigt einen Code zum Start der Fahrt.
* **QR-Code scannen (Driver):** Startet die Fahrt und das GPS-Tracking.
* **Notfall-Button:** Sendet Standort an Sicherheitsdienst.
* **Fahrt beenden:** Stoppt das Tracking und initiiert den Abschluss-Handshake.
**Visible Data**
* Dauer der aktuellen Fahrt (lokaler Timer).
* Aktueller GPS-Status ("Aufzeichnung läuft").
* Karte mit Route zum Ziel-Treffpunkt.

## Use Cases

Die Anwendungsfälle beschreiben die Interaktion der Nutzer mit der App.

### UC-01 - Fahrt validieren (Strict Mode)

**Goal**
Referenz zu G-01 (Verifizierte Mobilität).
**Prerequisites**
Fahrer und Mitfahrer haben ein "Match" bestätigt und befinden sich physisch am Start-Treffpunkt.
**Actors**

* Driver (User)
* Passenger (User)
* Backend Service (System Element)
**Main Scenario**

1. **Passenger** öffnet UI-02 und wählt "Fahrt starten". Die App generiert einen dynamischen, signierten QR-Code (enthält RideID + Timestamp).
2. **Driver** scannt den QR-Code mit seiner App.
3. Die App des Drivers verifiziert die Signatur (technische Funktion TF-01).
4. Beide Apps (Driver & Passenger) starten im Hintergrund die Aufzeichnung von GPS-Telemetrie (technische Funktion TF-02).
5. Die App zeigt beiden Nutzern "Fahrt aktiv" an.
6. Während der Fahrt senden beide Apps periodisch (z.B. alle 60 Sek.) verschlüsselte Standort-Pakete an den **Backend Service**.
7. Am Ziel angekommen, drückt der **Driver** auf "Fahrt beenden".
8. Der **Backend Service** prüft die Übereinstimmung der GPS-Spuren (Server-seitig).
9. Bei Erfolg zeigt die App "Fahrt erfolgreich - Credits vorgemerkt" an.

**Alternative scenarios**

* **3a. Scan fehlgeschlagen:** Der QR-Code ist ungültig oder abgelaufen. Die App fordert den Passenger auf, einen neuen Code zu generieren.
* **6a. Kein Internet:** Wenn während der Fahrt keine Verbindung besteht, puffert die App die GPS-Daten lokal (Entity E-02) und sendet sie, sobald die Verbindung wiederhergestellt ist (Batch-Upload).

### UC-02 - Route planen & Matchen

**Goal**
Referenz zu G-03 (Datenschutzfreundliche Navigation).
**Prerequisites**
Nutzer ist eingeloggt.
**Actors**

* Passenger (User)
* Routing Service (Partner Element)
**Main Scenario**

1. **Passenger** gibt auf UI-01 seine Startadresse ein.
2. Die App sendet die Koordinaten an den Backend Service.
3. Die App empfängt eine Liste von "Smart Meeting Points" in der Nähe (nicht die Haustür!).
4. **Passenger** wählt einen Punkt und bestätigt die Anfrage.

## Technical Functions

Interne Funktionen der App zur Sicherstellung der Logik.

### TF-01 - QR-Code Verification Engine

**Input**
Gescannter String aus dem QR-Code.
**Output**
Boolean (Valid/Invalid), RideID.
**Main functional flow**

1. Die Funktion parst den String.
2. Sie prüft die kryptografische Signatur des QR-Codes (um zu verhindern, dass Screenshots von alten Codes verwendet werden).
3. Sie prüft, ob der Timestamp im Code < 5 Minuten alt ist.
4. Output: Valid.

### TF-02 - Secure Telemetry Recorder

**Input**
System-GPS-Signal, RideID.
**Output**
Verschlüsseltes Datenpaket (Timestamp, Lat, Long, Accuracy).
**Main functional flow**

1. Die Funktion abonniert den Location-Service des Betriebssystems.
2. Alle X Sekunden (konfigurierbar) wird ein Datenpunkt erfasst.
3. Der Datenpunkt wird mit der RideID verknüpft und temporär in Entity E-02 (Ride Buffer) geschrieben.
4. Die Funktion prüft, ob eine Internetverbindung besteht. Falls ja, Aufruf von TI-02 (Upload).

## Technical Interfaces

Schnittstellen nach außen.

### TI-01 - Ride API Client

**Description**
Kommunikation mit dem Backend Server zur Verwaltung von Fahrten.
**Input**
JSON Objekte (Ride Requests, Status Updates).
**Output**
JSON Antwort (Bestätigung, Match-Daten).
**Action**

1. Ruft via HTTPS REST/GraphQL den Backend Service auf.
2. Übermittelt Auth-Token im Header.

### TI-02 - Telemetry Upload Stream

**Description**
Hochladen der GPS-Daten zur Betrugsprüfung.
**Input**
Liste von GPS-Punkten (aus E-02).
**Output**
HTTP 200 OK.
**Action**

1. Sendet die gepufferten GPS-Daten an den Backend-Endpunkt `/api/validate-ride`.
2. Löscht nach erfolgreicher Übertragung die Daten aus dem lokalen Speicher E-02 (Datensparsamkeit).

## Entities

Daten, die lokal auf dem Smartphone gespeichert werden.

### E-01 - User Session

**Description**
Speichert die Authentifizierungsdaten.
**Attributes**
| ID | Name | Data type | Description |
| --- | ---- | --------- | ----------- |
| 1 | AuthToken | String | JWT Token vom Identity Provider |
| 2 | UserRole | Enum | Student oder Mitarbeiter |
| 3 | UserID | UUID | Eindeutige ID des Nutzers |

### E-02 - Ride Buffer

**Description**
Temporärer Speicher für GPS-Daten während einer laufenden Fahrt (Wichtig für Offline-Szenarien und Option B).
**Attributes**
| ID | Name | Data type | Description |
| --- | ---- | --------- | ----------- |
| 1 | ActiveRideID | UUID | ID der aktuellen Fahrt |
| 2 | TelemetryBlob | List<Point> | Liste von GPS-Koordinaten & Zeitstempeln |
| 3 | PartnerStatus | Enum | Status des Partners (Scanning, Driving, Done) |

## Quality Requirements

Nicht-funktionale Anforderungen.

### QR-01 - Batterie-Effizienz

**Description**
Da Option B eine kontinuierliche GPS-Nutzung erfordert, darf der Akkuverbrauch 5% pro Stunde Fahrtzeit nicht überschreiten. Der GPS-Sampling-Algorithmus (TF-02) muss adaptiv arbeiten (z.B. auf der Autobahn seltener sampeln als in der Stadt).

### QR-02 - Offline-Resilienz

**Description**
Der Start einer Fahrt (QR-Scan) muss auch in Tiefgaragen ohne Internetverbindung funktionieren. Die Validierung erfolgt dann asynchron, sobald das Gerät wieder online ist.

## Constraints

Einschränkungen.

### C-01 - OS Background Permissions

**Description**
Sowohl iOS als auch Android beschränken den Zugriff auf GPS im Hintergrund massiv. Die App muss explizit die Berechtigung "Always Allow" oder "Allow while using app" (mit Foreground Service Notification) anfordern.
*Reference:* Apple iOS Human Interface Guidelines (Location Services).

### C-02 - GDPR / DSGVO (Datenlöschung)

**Description**
Die in E-02 und auf dem Server gespeicherten GPS-Feindaten dürfen keinesfalls länger als für den Validierungsprozess notwendig gespeichert werden. Nach der Bestätigung "Betrugsprüfung OK" müssen die Bewegungsdaten sofort vernichtet werden, nur die Metadaten (Start, Ziel, km) bleiben erhalten.

---

### 🛑 Kritische Entscheidung (Technik)

Ich habe im Konzept unter **QR-01 (Batterie)** und **TF-02 (Telemetry)** bereits eine Annahme getroffen, aber hier liegt ein Risiko.

Für "Option B - Strenger Schutz" müssen wir Standortdaten im Hintergrund sammeln, auch wenn der Nutzer das Handy in der Tasche hat (Bildschirm aus).
Sowohl Apple als auch Google machen das sehr schwer. Wenn der Nutzer die App "wegwischt" (killt), stoppt oft das Tracking.

**Wie wollen wir damit umgehen?**

* **Lösung 1 (High Tech):** Wir nutzen einen sogenannten "Foreground Service" (Android) bzw. "Background Location Indicator" (iOS). Das bedeutet: Während der Fahrt ist permanent eine kleine Notification in der Statusleiste sichtbar ("CampusRide zeichnet deine Fahrt auf"). Das garantiert, dass das Betriebssystem die App nicht beendet. **Nachteil:** Nutzer könnten das nervig finden.
* **Lösung 2 (Low Tech Check):** Wir tracken nur Start und Ende (Timestamp + Ort). Dazwischen tracken wir *nichts*. Wir berechnen nur: "Ist es physikalisch möglich, in Zeit X von A nach B zu kommen?". **Vorteil:** Spart Akku und Entwicklungsstress. **Nachteil:** Schützt nicht davor, dass der Passenger zu Hause sitzt und der Fahrer alleine fährt (Betrugslücke).

Soll ich für **Lösung 1 (Foreground Service)** im Detailkonzept bleiben, um den *strengen* Betrugsschutz zu gewährleisten, oder auf Lösung 2 wechseln?