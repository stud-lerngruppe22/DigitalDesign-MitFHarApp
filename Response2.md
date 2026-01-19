Das ist eine sehr vernünftige Entscheidung. Der Wechsel auf den **Low Tech Check** reduziert die Entwicklungszeit, den Batteriebedarf und die Datenschutz-Hürden massiv.

Das Sicherheitskonzept ändert sich dadurch von "Überwachung" zu **"Plausibilitätsprüfung"**.

* *Die Logik:* Wir prüfen nicht, *wo* sie während der Fahrt waren. Wir prüfen, ob die Zeit zwischen "Start-Scan" und "End-Bestätigung" zur Distanz passt (Teleportations-Schutz).

Hier ist das **erweiterte und detaillierte Element Design Concept** für die App, angepasst an diese Entscheidung.

---

# Element Design Concept - CampusRide Mobile App (Low Tech Edition)

## Goals

### G-01 - Verifizierte Mobilität (Plausibilität)

**Description**
Die App stellt sicher, dass Fahrten tatsächlich stattfinden, indem sie einen kryptografisch gesicherten Start-Handshake (QR-Scan) und einen zeitbasierten End-Handshake durchführt. Unmögliche Fahrten (z.B. 50km in 5 Minuten) werden durch Zeitstempel-Abgleich abgelehnt.

### G-02 - Barrierefreier "Walled Garden"

**Description**
Der Zugang zur App erfolgt ausschließlich über den Identity Provider der Hochschule (Shibboleth). Dies eliminiert die Notwendigkeit manueller Registrierungen und schafft einen vertrauenswürdigen Raum, in dem Klarnamen und Hochschul-Status (Student/Mitarbeiter) verifiziert sind.

### G-03 - Datenschutzfreundliche Routenführung

**Description**
Die App navigiert Nutzer zu definierten "Smart Meeting Points" (Campus-Hubs, P+R Parkplätze) statt zu Privatadressen. Die Privatsphäre wird geschützt, indem Wohnorte lokal auf dem Gerät maskiert bleiben und nur Treffpunkte an den Server übermittelt werden.

### G-04 - Offline-First Zuverlässigkeit

**Description**
Da Campus-Parkplätze und Tiefgaragen oft schlechten Empfang haben, müssen kritische Kernfunktionen (Ticket-Anzeige, Start-Scan) auch ohne aktive Internetverbindung funktionsfähig sein und Daten nachträglich synchronisieren.

## User Interfaces

### UI-01 - Dashboard & Ride Matcher

**Description**
Der zentrale Hub der App für Fahrer und Mitfahrer. Hier werden Fahrten gesucht, angeboten und verwaltet.
**Actions**

* **Fahrt suchen (Passenger):** Filterung nach Zielcampus, Ankunftszeit und (optional) "Women-only Ride".
* **Fahrt anbieten (Driver):** Erstellung von Serien-Terminen (z.B. "Jeden Dienstag 08:00") oder Einzelfahrten.
* **Quick-Match:** Ein-Klick-Buchung für die häufigste Route (z.B. "Nach Hause").
**Visible Data**
* "Mein Karma-Score" (Zuverlässigkeitsindex).
* Gesammelte Credits (für Fahrer) / Genutzte Freikilometer (für Mitfahrer).
* Karten-Vorschau der Treffpunkte.

### UI-02 - Active Ride Mode (Der "Low Tech" Screen)

**Description**
Dieser Screen erscheint während einer aktiven Fahrt. Er verbraucht kaum Energie, da kein GPS-Tracking läuft.
**Actions**

* **Check-In (Start):** Passenger zeigt QR, Driver scannt.
* **Check-Out (Ende):** Button "Ankunft bestätigen" (löst GPS-Snapshot und Zeitstempel aus).
* **Notfall-Hilfe:** Schnellzugriff auf Campus-Security Nummer.
* **Navigation:** Weiterleitung an externe App (Google Maps/Apple Maps) zum Treffpunkt.
**Visible Data**
* Name und Studiengang des Mitfahrers/Fahrers.
* Fahrzeugmodell und Farbe.
* Geschätzte Ankunftszeit (ETA).

### UI-03 - Wallet & History

**Description**
Übersicht über die erbrachten Leistungen im Solidarmodell.
**Actions**

* **Auszahlungsdaten:** Eingabe der IBAN (nur Driver).
* **Export:** PDF-Download des Semester-Nachweises.
**Visible Data**
* Liste aller validierten Fahrten (Datum, km, Status).
* Voraussichtliche Auszahlungshöhe am Semesterende (Schätzwert basierend auf aktuellem Topf).

## Use Cases

### UC-01 - Fahrt validieren (Plausibilitäts-Check)

**Goal**
Referenz zu G-01.
**Prerequisites**
Match besteht, Nutzer sind am Treffpunkt.
**Actors**

* Driver, Passenger, Backend Service.
**Main Scenario**

1. **Passenger** öffnet UI-02 und generiert einen Start-QR-Code (enthält RideID + Start-Timestamp + verschlüsseltes "Secret").
2. **Driver** scannt den Code. Die App speichert lokal: `Startzeit: 14:00`.
3. Die Fahrt beginnt. Die App ist inaktiv (kein Tracking).
4. Am Ziel angekommen, öffnen beide die App.
5. **Driver** drückt "Fahrt beenden". Die App nimmt einen **einmaligen** GPS-Snapshot und Zeitstempel (`Endzeit: 14:45`).
6. Die App sendet das Datenpaket (Startzeit, Endzeit, Startort-ID, Endort-GPS) an den Server.
7. **Server-Logik:** Der Server prüft:
* Ist die Zeitdifferenz (45 Min) realistisch für die Strecke (30km)?
* Ist der Endort in der Nähe des geplanten Ziels (Radius 500m)?


8. Falls ja: Fahrt wird als "Validiert" markiert. Credits werden gutgeschrieben.

**Alternative scenarios**

* **5a. Mitfahrer vergisst Bestätigung:** Der Fahrer kann die Fahrt einseitig beenden. Der Passenger erhält eine Push-Nachricht zur Bestätigung ("Bist du angekommen?"). Bestätigt er nicht binnen 24h, gilt die Fahrt als validiert, aber der Trust-Score des Passengers sinkt.
* **7a. Teleportation erkannt (Betrug):** Wenn Startzeit 14:00 und Endzeit 14:05 bei 50km Strecke -> Fahrt wird abgelehnt, Account wird für manuelles Review geflaggt.

### UC-02 - Onboarding & Verifizierung

**Goal**
Referenz zu G-02.
**Prerequisites**
App installiert.
**Actors**

* User, Identity Provider (Hochschule).
**Main Scenario**

1. User wählt seine Hochschule aus.
2. App öffnet In-App-Browser mit der Shibboleth-Loginmaske der Uni.
3. User gibt Matrikelnummer/Passwort ein.
4. Identity Provider sendet erfolgreiches Token + Attribute (Vorname, Status: "Student").
5. User ergänzt Profil (Auto-Modell, Farbe, Raucher/Nichtraucher).

### UC-03 - Ad-Hoc Suche (Spontanfahrt)

**Goal**
Referenz zu G-04.
**Prerequisites**
User hat GPS aktiviert.
**Actors**

* Passenger, Backend Service.
**Main Scenario**

1. Passenger aktiviert "Fahrt suchen".
2. App ermittelt aktuellen Standort.
3. App zeigt "Abfahrten in der Nähe" (ähnlich wie eine Abfahrtafel am Bahnhof).
4. Passenger klickt auf eine Fahrt -> Anfrage an Fahrer wird gesendet.

## Technical Functions

### TF-01 - Offline Token Generator

**Input**
RideID, User-Secret.
**Output**
Signierter QR-String.
**Main functional flow**

1. Generiert einen Zeitstempel (Unix Timestamp).
2. Erstellt einen Hash aus `RideID + Timestamp + UserSecret`.
3. Erzeugt den QR-Code Payload. Funktioniert komplett ohne Netz, da das Secret beim Login lokal gespeichert wurde.

### TF-02 - Plausibility Pre-Check (Client Side)

**Input**
Startzeit, Endzeit, geschätzte Dauer (aus Routenplanung).
**Output**
Warnung oder OK.
**Main functional flow**

1. Bevor die Daten hochgeladen werden, prüft die App lokal: Ist `(Endzeit - Startzeit) < (Geschätzte Dauer * 0.5)`?
2. Falls ja (User war viel zu schnell/hat sofort wieder beendet): Warnhinweis "Fahrt zu kurz für Gutschrift" anzeigen. Dies reduziert Server-Last und Frust durch spätere Ablehnung.

### TF-03 - Snapshot Locator

**Input**
Trigger "Fahrt beenden".
**Output**
Single GPS Coordinate.
**Main functional flow**

1. Fordert vom OS die *aktuelle* Position an (High Accuracy, einmalig).
2. Wenn GPS nicht verfügbar (Tiefgarage), speichert es "Location Missing" und fordert den Nutzer auf, es später zu bestätigen, sobald Empfang besteht.

## Technical Interfaces

### TI-01 - CampusRide API (REST/GraphQL)

**Description**
Die Hauptschnittstelle zum Backend.
**Input**
Auth-Header, JSON Body.
**Output**
JSON Response.
**Action**
Verwaltet Fahrten (POST /ride), Updates (PUT /ride/{id}) und User-Profile.

### TI-02 - Map & Routing Provider API

**Description**
Anbindung an Mapbox oder Google Maps Platform.
**Input**
Start-Koordinate, Ziel-Koordinate.
**Output**
RouteObject (Distanz in Meter, Dauer in Sekunden, Polyline für Karte).
**Action**
Wird genutzt, um *vor* der Fahrt die erwarteten "Credits" zu berechnen und die Route auf der Karte zu zeichnen.

### TI-03 - University IdP (SAML/OIDC)

**Description**
Schnittstelle zur Hochschul-IT.
**Input**
User-Credentials (im Browser).
**Output**
Identity Token (JWT).
**Action**
Authentifiziert den Nutzer und liefert Stammdaten (Name, Status) ohne Zugriff auf Noten oder Verwaltung.

## Entities

### E-01 - Local Ride Cache

**Description**
Speichert Fahrtdaten temporär, bis sie hochgeladen sind.
**Attributes**
| ID | Name | Data type | Description |
| --- | ---- | --------- | ----------- |
| 1 | RideID | UUID | ID der Fahrt |
| 2 | StartTime | Timestamp | Scan-Zeitpunkt |
| 3 | EndTime | Timestamp | Abschluss-Zeitpunkt |
| 4 | EndGeo | GeoPoint | GPS beim Beenden |
| 5 | SyncStatus | Enum | Pending / Uploaded / Failed |

### E-02 - User Profile Settings

**Description**
Lokale Einstellungen.
**Attributes**
| ID | Name | Data type | Description |
| --- | ---- | --------- | ----------- |
| 1 | MaxDetour | Integer | Max. Umweg in Minuten (für Fahrer) |
| 2 | PrivacyLevel | Enum | Standard / High (zeigt Profilbild nur bestätigten Matches) |
| 3 | Accessibility | Boolean | Benötigt barrierefreien Zugang/Kofferraum |

## Quality Requirements

### QR-01 - Akku-Neutralität

**Description**
Da wir "Low Tech" nutzen (kein Background-GPS), darf die App im Hintergrund (während der Fahrt) **0% CPU-Last** erzeugen. Sie darf nur beim Starten und Beenden aktiv sein.

### QR-02 - Offline-Toleranz (24h)

**Description**
Ein Fahrer muss in der Lage sein, morgens ohne Internet eine Fahrt zu scannen und abends ohne Internet zu beenden. Die Synchronisation (Upload zu TI-01) muss erfolgreich sein, selbst wenn sie erst 24 Stunden später im WLAN erfolgt.

### QR-03 - "3-Click" Usability

**Description**
Eine Fahrt muss mit maximal 3 Interaktionen gestartet werden können (App öffnen -> Fahrt wählen -> QR scannen), um Staus an Parkplatzeinfahrten zu vermeiden.

## Constraints

### C-01 - Zeitmanipulation

**Description**
Da wir auf Zeitstempel zur Betrugsprüfung setzen, muss die App sicherstellen, dass sie die **Server-Zeit** (Network Time Protocol) nutzt und nicht die lokal verstellbare Geräte-Uhrzeit, um Manipulationen zu verhindern.

### C-02 - Geofencing Limits

**Description**
Smart Meeting Points müssen einen Toleranzradius von mind. 200m haben, da GPS in bebauten Campus-Gebieten ungenau sein kann.