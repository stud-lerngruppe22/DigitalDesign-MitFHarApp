# System Design Concept: Campus-Mitfahrgelegenheiten-App

## Goals

Das technische System soll folgende Ziele erreichen:

### Ziel 1: Sichere Nutzeridentifikation und Verifizierung
Das System muss sicherstellen, dass nur verifizierte Studierende der Hochschule die Plattform nutzen können. Die Authentifizierung erfolgt über das bestehende Hochschul-Authentifizierungssystem (Single Sign-On).

### Ziel 2: Effizientes Matching von Fahrten und Mitfahrern
Das System muss Fahrtangebote und Mitfahranfragen basierend auf Route, Zeit und Präferenzen effizient matchen können. Der Matching-Algorithmus soll innerhalb von 2 Sekunden passende Ergebnisse liefern.

### Ziel 3: Zuverlässige Echtzeit-Kommunikation
Das System muss Echtzeitkommunikation zwischen Fahrern und Mitfahrern ermöglichen, einschließlich Push-Benachrichtigungen bei Buchungsanfragen, Bestätigungen, Änderungen und Erinnerungen.

### Ziel 4: Persistente und sichere Datenspeicherung
Das System muss alle Nutzerprofile, Fahrtangebote, Buchungen, Bewertungen und Nachrichten persistent und sicher speichern. Die Daten müssen DSGVO-konform verarbeitet und bei Bedarf gelöscht werden können.

### Ziel 5: Vertrauensbildung durch Bewertungssystem
Das System muss ein bidirektionales Bewertungssystem implementieren, das nach jeder abgeschlossenen Fahrt Bewertungen ermöglicht und diese in aggregierter Form in den Nutzerprofilen anzeigt.

### Ziel 6: Verwaltung und Monitoring
Das System muss der Studierendenvertretung Zugriff auf anonymisierte Statistiken, Nutzerverwaltung und Konfliktmanagement bieten.

### Ziel 7: Kostenabwicklung und Transparenz
Das System muss die Berechnung und transparente Darstellung von Fahrtkosten ermöglichen und optional die Integration mit Zahlungsdienstleistern für direkte Zahlungsabwicklung unterstützen.

## System Architecture

### User Types

#### Studierender (Fahrer)
Nutzer, der ein eigenes Fahrzeug besitzt und Mitfahrgelegenheiten zum Campus anbietet. Verwendet die iOS App oder Android App.

#### Studierender (Mitfahrer)
Nutzer, der nach Mitfahrgelegenheiten zum Campus sucht. Verwendet die iOS App oder Android App.

#### Administrator (Studierendenvertretung)
Nutzer, der die Plattform verwaltet, Statistiken einsieht und bei Konflikten moderiert. Verwendet das Web-Admin-Portal.

#### IT-Administrator (Hochschul-IT)
Nutzer, der die Hochschul-Authentifizierung und Server-Infrastruktur betreut. Verwendet direkt die Hochschul-Systeme.

### Software Elements

#### iOS Mobile App
Native iOS-Anwendung entwickelt in Swift für iPhone-Nutzer (iOS 14+). 

**Hauptfunktionen:**
- Registrierung und Login über Hochschul-SSO
- Erstellung und Verwaltung von Fahrtangeboten
- Suche und Buchung von Mitfahrgelegenheiten
- Echtzeit-Chat zwischen Fahrern und Mitfahrern
- Anzeige von Routen mit Integration von Apple Maps
- Verwaltung von Buchungen und Fahrthistorie
- Bewertungsfunktion nach abgeschlossenen Fahrten
- Empfang von Push-Benachrichtigungen
- Profilverwaltung mit Präferenzen

#### Android Mobile App
Native Android-Anwendung entwickelt in Kotlin für Android-Nutzer (Android 8+).

**Hauptfunktionen:**
- Identisch zur iOS App
- Integration von Google Maps
- Material Design UI-Komponenten

#### Backend Server (Node.js)
Server-Anwendung entwickelt in Node.js mit Express Framework.

**Hauptfunktionen:**
- RESTful API für alle Client-Anfragen
- Authentifizierung und Autorisierung
- Matching-Algorithmus für Fahrten
- Verwaltung von Nutzerprofilen, Fahrtangeboten, Buchungen
- Berechnung von Fahrtkosten
- Versand von Push-Benachrichtigungen über Pusher
- Speicherung und Abruf von Chat-Nachrichten
- Aggregation von Bewertungen
- Bereitstellung anonymisierter Statistiken
- Automatische Erinnerungen und Benachrichtigungen (Cron Jobs)

#### Web-Admin-Portal
Web-Anwendung für die Studierendenvertretung zur Verwaltung der Plattform.

**Hauptfunktionen:**
- Dashboard mit Nutzungsstatistiken (Anzahl Nutzer, Fahrten, CO2-Einsparung)
- Nutzerverwaltung (Suche, Ansicht, Status-Änderung, Sperrung)
- Konfliktmanagement (Support-Tickets, Kommunikationshistorie)
- Systemkonfiguration (z.B. maximale Fahrtkosten-Obergrenzen)
- Export von Berichten

#### Database Management System
PostgreSQL-Datenbank zur persistenten Speicherung aller Systemdaten.

**Gespeicherte Daten:**
- Nutzerprofile
- Fahrtangebote
- Buchungen
- Bewertungen
- Nachrichten
- Benachrichtigungen
- Audit-Logs

### Hardware Elements

#### Hochschul-Server
Physischer oder virtueller Server, der im Rechenzentrum der Hochschule gehostet wird.

**Spezifikationen (Mindestanforderungen):**
- CPU: 8 Kerne
- RAM: 16 GB
- Storage: 500 GB SSD
- Netzwerk: 1 Gbit/s Anbindung
- Betriebssystem: Linux (Ubuntu Server 22.04 LTS)

**Gehostete Software:**
- Backend Server (Node.js)
- PostgreSQL Database
- Backup-System

#### Studierenden-Smartphone (iOS)
iPhone des Studierenden (iOS 14 oder höher).

**Anforderungen:**
- Aktive Internetverbindung (WiFi oder mobiles Netz)
- GPS-Funktion
- Push-Benachrichtigungen aktiviert

#### Studierenden-Smartphone (Android)
Android-Smartphone des Studierenden (Android 8 oder höher).

**Anforderungen:**
- Aktive Internetverbindung (WiFi oder mobiles Netz)
- GPS-Funktion
- Google Play Services installiert
- Push-Benachrichtigungen aktiviert

#### Admin-Arbeitsplatz
Computer oder Laptop für Mitarbeiter der Studierendenvertretung.

**Anforderungen:**
- Moderner Webbrowser (Chrome, Firefox, Safari, Edge)
- Zugang zum Hochschul-Netzwerk (VPN bei Remote-Zugriff)

### Partner Elements

#### Hochschul-Authentifizierungssystem
Bestehendes Single Sign-On (SSO) System der Hochschule zur Verifizierung von Studierenden.

**Technologie:** OAuth 2.0 oder SAML 2.0

**Bereitgestellte Funktionen:**
- Authentifizierung mit Hochschul-Zugangsdaten
- Bereitstellung von Nutzerinformationen (Name, E-Mail, Matrikelnummer)
- Session-Management

#### Apple Maps / MapKit
Kartendienst von Apple für iOS App.

**Bereitgestellte Funktionen:**
- Anzeige von Karten
- Routenberechnung
- Geokodierung und Reverse-Geokodierung
- Navigation

#### Google Maps API
Kartendienst von Google für Android App.

**Bereitgestellte Funktionen:**
- Anzeige von Karten
- Routenberechnung
- Geokodierung und Reverse-Geokodierung
- Navigation

#### Pusher
Managed Service für Echtzeit-Messaging und Push-Benachrichtigungen.

**Bereitgestellte Funktionen:**
- Push-Benachrichtigungen für iOS und Android
- WebSocket-Verbindungen für Echtzeit-Chat
- Präsenz-Informationen (online/offline Status)

#### PayPal API (optional)
Zahlungsdienstleister für optionale integrierte Zahlungsabwicklung.

**Bereitgestellte Funktionen:**
- Peer-to-Peer Zahlungen zwischen Studierenden
- Sichere Zahlungsabwicklung
- Transaktionshistorie

## System Scenarios

### Szenario 1: Registrierung und Verifizierung eines neuen Nutzers

**Ziel:** Ein neuer Studierender soll sich registrieren und über das Hochschul-Authentifizierungssystem verifiziert werden.

1. **Studierender** öffnet die **iOS Mobile App** oder **Android Mobile App** auf seinem **Studierenden-Smartphone**
2. **Mobile App** zeigt Login-Screen mit "Mit Hochschul-Account anmelden" Button an
3. **Studierender** tippt auf den Button
4. **Mobile App** sendet Authentifizierungsanfrage an **Backend Server**
5. **Backend Server** leitet zur **Hochschul-Authentifizierungssystem** OAuth-Seite weiter
6. **Studierender** gibt Hochschul-Benutzername und Passwort im **Hochschul-Authentifizierungssystem** ein
7. **Hochschul-Authentifizierungssystem** validiert Anmeldedaten und sendet Authentifizierungs-Token und Nutzerdaten (Name, E-Mail, Matrikelnummer) an **Backend Server**
8. **Backend Server** erstellt neues Nutzerprofil in **Database Management System** mit Status "verifiziert"
9. **Backend Server** sendet Bestätigung und Session-Token an **Mobile App**
10. **Mobile App** zeigt Willkommens-Screen und fordert **Studierenden** auf, Profil zu vervollständigen (Profilbild, Präferenzen)
11. **Studierender** gibt zusätzliche Informationen ein
12. **Mobile App** sendet Profildaten an **Backend Server**
13. **Backend Server** speichert aktualisierte Profildaten in **Database Management System**
14. **Mobile App** zeigt Hauptbildschirm der App an

### Szenario 2: Erstellen eines Fahrtangebots

**Ziel:** Ein Fahrer soll eine einmalige oder regelmäßige Fahrt zum Campus anbieten können.

1. **Studierender (Fahrer)** öffnet die **Mobile App** auf seinem **Studierenden-Smartphone**
2. **Mobile App** zeigt Hauptbildschirm mit "Fahrt anbieten" Button
3. **Studierender (Fahrer)** tippt auf "Fahrt anbieten"
4. **Mobile App** zeigt Formular für Fahrtdetails
5. **Studierender (Fahrer)** gibt Startadresse, Zieladresse (Campus), Abfahrtsdatum und -uhrzeit, Anzahl verfügbarer Plätze ein
6. **Mobile App** verwendet **Apple Maps** oder **Google Maps API** zur Validierung und Geokodierung der Adressen
7. **Studierender (Fahrer)** wählt Fahrttyp (einmalig oder regelmäßig) und optional Wiederholungsmuster
8. **Mobile App** sendet Anfrage für Kostenvorschlag an **Backend Server** mit Routeninformationen
9. **Backend Server** berechnet Kostenvorschlag basierend auf Entfernung
10. **Mobile App** zeigt Kostenvorschlag an, **Studierender (Fahrer)** kann diesen übernehmen oder anpassen
11. **Studierender (Fahrer)** gibt optional Zwischenstopps und Präferenzen an
12. **Studierender (Fahrer)** bestätigt Fahrtangebot
13. **Mobile App** sendet Fahrtangebot an **Backend Server**
14. **Backend Server** speichert Fahrtangebot in **Database Management System**
15. Bei regelmäßigen Fahrten: **Backend Server** generiert automatisch Serie von Fahrtangebots-Instanzen
16. **Backend Server** sucht nach passenden Suchanfragen in **Database Management System**
17. Für jeden Match: **Backend Server** sendet Push-Benachrichtigung über **Pusher** an potenzielle Mitfahrer
18. **Backend Server** sendet Bestätigung an **Mobile App**
19. **Mobile App** zeigt Bestätigungs-Screen und Übersicht des erstellten Angebots

### Szenario 3: Suchen und Buchen einer Mitfahrgelegenheit

**Ziel:** Ein Mitfahrer soll eine passende Fahrt finden und buchen können.

1. **Studierender (Mitfahrer)** öffnet die **Mobile App** auf seinem **Studierenden-Smartphone**
2. **Mobile App** zeigt Hauptbildschirm mit "Fahrt suchen" Button
3. **Studierender (Mitfahrer)** tippt auf "Fahrt suchen"
4. **Mobile App** zeigt Suchformular
5. **Studierender (Mitfahrer)** gibt Startort, Zielort (Campus), gewünschtes Datum und Zeitfenster ein
6. **Mobile App** verwendet **Apple Maps** oder **Google Maps API** zur Geokodierung der Adressen
7. **Mobile App** sendet Suchanfrage an **Backend Server**
8. **Backend Server** führt Matching-Algorithmus aus und sucht passende Fahrtangebote in **Database Management System**
9. **Backend Server** sortiert Ergebnisse nach Relevanz (Zeit, Route, Bewertung des Fahrers)
10. **Backend Server** sendet Liste passender Fahrtangebote an **Mobile App**
11. **Mobile App** zeigt Suchergebnisse mit Karte (**Apple Maps** / **Google Maps API**) und Liste an
12. **Studierender (Mitfahrer)** wählt ein Fahrtangebot aus
13. **Mobile App** zeigt Detailansicht mit Fahrerinfo, Bewertungen, Route, Kosten
14. **Studierender (Mitfahrer)** kann optional Einstiegsort anpassen (wenn Zwischenstopps verfügbar)
15. **Studierender (Mitfahrer)** tippt auf "Mitfahrt anfragen"
16. **Mobile App** sendet Buchungsanfrage an **Backend Server**
17. **Backend Server** erstellt Buchung mit Status "angefragt" in **Database Management System**
18. **Backend Server** sendet Push-Benachrichtigung über **Pusher** an **Mobile App** des Fahrers
19. **Mobile App** des Fahrers zeigt Benachrichtigung auf **Studierenden-Smartphone** des Fahrers
20. **Studierender (Fahrer)** öffnet Buchungsanfrage in **Mobile App**
21. **Mobile App** zeigt Profil des Mitfahrers (Bewertung, bisherige Fahrten)
22. **Studierender (Fahrer)** bestätigt oder lehnt Anfrage ab
23. **Mobile App** sendet Entscheidung an **Backend Server**
24. **Backend Server** aktualisiert Buchungsstatus in **Database Management System**
25. **Backend Server** sendet Push-Benachrichtigung über **Pusher** an **Mobile App** des Mitfahrers
26. **Mobile App** des Mitfahrers zeigt Bestätigung oder Ablehnung an
27. Bei Bestätigung: **Mobile App** zeigt Fahrtdetails und Kontaktmöglichkeit zum Fahrer

### Szenario 4: Echtzeit-Kommunikation und Fahrtdurchführung

**Ziel:** Fahrer und Mitfahrer sollen während der Fahrt kommunizieren können und Statusupdates erhalten.

1. Am Fahrtag, 30 Minuten vor Abfahrt: **Backend Server** führt geplanten Cron Job aus
2. **Backend Server** lädt bevorstehende Fahrten aus **Database Management System**
3. **Backend Server** sendet Erinnerungs-Push-Benachrichtigungen über **Pusher** an alle beteiligten Nutzer
4. **Studierender (Fahrer)** und **Studierender (Mitfahrer)** erhalten Benachrichtigung auf ihren **Studierenden-Smartphones**
5. **Studierender (Fahrer)** öffnet **Mobile App** und navigiert zu Fahrtdetails
6. **Studierender (Fahrer)** tippt auf Chat-Symbol
7. **Mobile App** öffnet WebSocket-Verbindung zu **Pusher**
8. **Studierender (Fahrer)** schreibt Nachricht "Bin in 5 Minuten da"
9. **Mobile App** sendet Nachricht über **Pusher** an **Backend Server**
10. **Backend Server** speichert Nachricht in **Database Management System**
11. **Backend Server** leitet Nachricht über **Pusher** an **Mobile App** des Mitfahrers weiter
12. **Mobile App** des Mitfahrers zeigt Nachricht in Echtzeit an
13. Bei Verspätung: **Studierender (Fahrer)** kann "Status-Update senden" wählen
14. **Mobile App** sendet Update an **Backend Server**
15. **Backend Server** sendet automatisch Push-Benachrichtigung über **Pusher** an alle Mitfahrer
16. Nach erfolgreicher Abholung: **Studierender (Fahrer)** tippt auf "Fahrt starten"
17. **Mobile App** öffnet Navigation mit **Apple Maps** oder **Google Maps API**
18. Nach Ankunft: **Studierender (Fahrer)** tippt auf "Fahrt abschließen"
19. **Mobile App** sendet Fahrtabschluss an **Backend Server**
20. **Backend Server** aktualisiert alle Buchungen auf Status "abgeschlossen" in **Database Management System**
21. Bei PayPal-Integration: **Backend Server** kommuniziert mit **PayPal API** zur Zahlungsabwicklung
22. **Backend Server** sendet Bewertungsaufforderung über **Pusher** an alle Beteiligten

### Szenario 5: Gegenseitige Bewertung nach Fahrt

**Ziel:** Fahrer und Mitfahrer sollen sich nach abgeschlossener Fahrt gegenseitig bewerten können.

1. **Studierender** erhält Push-Benachrichtigung zur Bewertung auf **Studierenden-Smartphone**
2. **Studierender** öffnet **Mobile App**
3. **Mobile App** zeigt Aufforderung zur Bewertung der abgeschlossenen Fahrt
4. **Studierender** tippt auf "Jetzt bewerten"
5. **Mobile App** zeigt Bewertungsformular
6. **Studierender** vergibt Sterne (1-5) und bewertet Kategorien (Pünktlichkeit, Freundlichkeit, Fahrstil)
7. **Studierender** kann optional einen Kommentar hinzufügen
8. **Studierender** tippt auf "Bewertung absenden"
9. **Mobile App** sendet Bewertung an **Backend Server**
10. **Backend Server** speichert Bewertung in **Database Management System**
11. **Backend Server** berechnet neuen Bewertungsdurchschnitt des bewerteten Nutzers
12. **Backend Server** aktualisiert Nutzerprofil in **Database Management System**
13. **Backend Server** sendet Push-Benachrichtigung über **Pusher** an bewerteten Nutzer
14. **Mobile App** des bewerteten Nutzers zeigt Benachrichtigung über neue Bewertung
15. Bewertung wird für andere Nutzer sichtbar im Profil angezeigt

### Szenario 6: Administration und Konfliktmanagement

**Ziel:** Die Studierendenvertretung soll die Plattform verwalten und bei Konflikten moderieren können.

1. **Administrator** öffnet **Web-Admin-Portal** auf seinem **Admin-Arbeitsplatz**
2. **Web-Admin-Portal** sendet Authentifizierungsanfrage an **Backend Server**
3. **Backend Server** validiert Admin-Rechte über **Hochschul-Authentifizierungssystem**
4. **Web-Admin-Portal** zeigt Dashboard mit Statistiken aus **Database Management System**
5. **Studierender** meldet Problem über **Mobile App** (z.B. unzuverlässiger Nutzer)
6. **Mobile App** sendet Support-Ticket an **Backend Server**
7. **Backend Server** speichert Ticket in **Database Management System**
8. **Backend Server** sendet E-Mail-Benachrichtigung an **Administrator**
9. **Administrator** sieht neues Ticket im **Web-Admin-Portal**
10. **Web-Admin-Portal** lädt Ticket-Details, Buchungshistorie, Bewertungen aus **Database Management System**
11. **Administrator** prüft den Fall
12. **Administrator** kann über **Web-Admin-Portal** Nachricht an betroffene Nutzer senden
13. **Web-Admin-Portal** sendet Nachricht über **Backend Server**
14. **Backend Server** sendet Push-Benachrichtigung über **Pusher** an betroffene Nutzer
15. **Administrator** trifft Entscheidung (Verwarnung, Sperrung)
16. **Administrator** ändert Nutzerstatus im **Web-Admin-Portal**
17. **Web-Admin-Portal** sendet Update an **Backend Server**
18. **Backend Server** aktualisiert Nutzerprofil in **Database Management System**
19. **Backend Server** sendet Push-Benachrichtigung über **Pusher** an betroffenen Nutzer
20. **Mobile App** des betroffenen Nutzers zeigt Benachrichtigung über Status-Änderung

### Szenario 7: Regelmäßige Fahrgemeinschaft organisieren

**Ziel:** Ein Fahrer soll eine wiederkehrende Fahrgemeinschaft einrichten können, die Mitfahrer für mehrere Termine buchen können.

1. **Studierender (Fahrer)** erstellt Fahrtangebot über **Mobile App** (wie in Szenario 2)
2. **Studierender (Fahrer)** wählt Fahrttyp "regelmäßig"
3. **Mobile App** zeigt Wiederholungsoptionen (z.B. jeden Montag, Mittwoch, Freitag)
4. **Studierender (Fahrer)** wählt Wochentage und Zeitraum (z.B. nächste 8 Wochen)
5. **Mobile App** sendet Serienfahrt an **Backend Server**
6. **Backend Server** generiert automatisch einzelne Fahrtangebots-Instanzen in **Database Management System**
7. **Studierender (Mitfahrer)** findet und bucht eine Fahrt aus der Serie (wie in Szenario 3)
8. **Mobile App** zeigt nach erfolgreicher Buchung Option "Für alle zukünftigen Fahrten dieser Serie buchen"
9. **Studierender (Mitfahrer)** wählt diese Option
10. **Mobile App** sendet Serien-Buchungsanfrage an **Backend Server**
11. **Backend Server** erstellt Buchungen für alle zukünftigen Fahrten der Serie in **Database Management System**
12. **Backend Server** sendet Bestätigung über **Pusher** an beide Nutzer
13. **Backend Server** führt wöchentlich automatische Erinnerungen über **Pusher** aus
14. Bei Änderung: **Studierender (Fahrer)** kann einzelne Fahrt absagen
15. **Mobile App** sendet Stornierung an **Backend Server**
16. **Backend Server** aktualisiert Fahrt-Status in **Database Management System**
17. **Backend Server** sendet automatisch Push-Benachrichtigung über **Pusher** an alle gebuchten Mitfahrer
18. **Studierender (Mitfahrer)** kann einzelne Fahrten der Serie stornieren ohne die gesamte Serie zu beenden

### Szenario 8: Datenexport und Statistiken

**Ziel:** Die Studierendenvertretung soll anonymisierte Statistiken zur Erfolgsmessung der Plattform abrufen können.

1. **Administrator** öffnet **Web-Admin-Portal** auf **Admin-Arbeitsplatz**
2. **Administrator** navigiert zu "Statistiken & Berichte"
3. **Administrator** wählt Zeitraum (z.B. letzter Monat)
4. **Web-Admin-Portal** sendet Anfrage an **Backend Server**
5. **Backend Server** führt Aggregations-Queries auf **Database Management System** aus
6. **Backend Server** berechnet Statistiken:
   - Anzahl registrierter Nutzer
   - Anzahl durchgeführter Fahrten
   - Durchschnittliche Auslastung pro Fahrt
   - Geschätzte CO2-Einsparung
   - Nutzungsverteilung nach Wochentagen/Uhrzeiten
7. **Backend Server** anonymisiert alle personenbezogenen Daten
8. **Backend Server** sendet Statistiken an **Web-Admin-Portal**
9. **Web-Admin-Portal** visualisiert Daten in Diagrammen und Tabellen
10. **Administrator** kann Bericht als PDF oder CSV exportieren
11. **Web-Admin-Portal** generiert Export-Datei
12. **Administrator** lädt Datei herunter auf **Admin-Arbeitsplatz**

## Quality Requirements

### Verfügbarkeit
- Das System muss eine Verfügbarkeit von mindestens 99% während der Vorlesungszeiten (Mo-Fr, 07:00-20:00 Uhr) gewährleisten
- Geplante Wartungsarbeiten müssen außerhalb der Stoßzeiten (nachts oder am Wochenende) durchgeführt werden
- Bei Ausfall des Backend Servers muss ein automatisches Backup-System greifen
- Die Mobile Apps müssen auch bei temporärer Netzwerkunterbrechung grundlegende Informationen (letzte Fahrten, Profil) anzeigen können

### Performance
- Die Mobile Apps müssen innerhalb von 2 Sekunden nach Start die Hauptansicht anzeigen
- Der Matching-Algorithmus des Backend Servers muss Suchergebnisse innerhalb von 2 Sekunden liefern
- Push-Benachrichtigungen müssen innerhalb von 10 Sekunden nach Auslösung über Pusher zugestellt werden
- Die Mobile Apps müssen bei gleichzeitiger Nutzung durch 1000+ Nutzer performant bleiben
- Das Web-Admin-Portal muss Statistiken für bis zu 10.000 Nutzer innerhalb von 5 Sekunden laden können
- Die Database Management System muss Lese- und Schreiboperationen innerhalb von 100ms durchführen

### Skalierbarkeit
- Das Backend Server System muss horizontal skalierbar sein (Load Balancing möglich)
- Die PostgreSQL Database muss bis zu 10.000 Nutzer, 50.000 Fahrten und 100.000 Buchungen ohne Performance-Einbußen verwalten können
- Bei steigender Nutzerzahl muss der Hochschul-Server einfach um zusätzliche Ressourcen erweitert werden können

### Sicherheit
- Alle Kommunikation zwischen Mobile Apps und Backend Server muss über HTTPS/TLS 1.3 verschlüsselt erfolgen
- Die Authentifizierung muss über OAuth 2.0 Token mit dem Hochschul-Authentifizierungssystem erfolgen
- Session-Tokens müssen nach 24 Stunden ablaufen und neu authentifiziert werden
- Passwörter dürfen niemals im Backend Server oder Database Management System gespeichert werden (delegiert an Hochschul-System)
- API-Endpoints des Backend Servers müssen gegen SQL-Injection, XSS und CSRF abgesichert sein
- Das Web-Admin-Portal muss zusätzliche Zwei-Faktor-Authentifizierung für Administratoren erfordern
- Sensible Daten (z.B. vollständige Adressen) dürfen nur für berechtigte Nutzer (gebuchte Fahrten) sichtbar sein
- Bei PayPal-Integration: Keine Speicherung von Zahlungsinformationen im eigenen System (PCI-DSS-Konformität)

### Datenschutz (DSGVO)
- GPS-Standortdaten dürfen nur während aktiver Fahrten erfasst werden und müssen nach Fahrtende gelöscht werden
- Alle personenbezogenen Daten müssen auf Anfrage exportiert werden können (Datenportabilität)
- Nutzer müssen ihre Daten vollständig löschen können (Recht auf Vergessenwerden)
- Gelöschte Nutzerprofile müssen in Bewertungen und Fahrthistorien anonymisiert werden
- Das System muss detaillierte Audit-Logs für alle Datenzugriffe führen
- Für Statistiken im Web-Admin-Portal dürfen nur anonymisierte und aggregierte Daten verwendet werden
- Die PostgreSQL Database muss Verschlüsselung at-rest unterstützen

### Benutzerfreundlichkeit (Usability)
- Die Mobile Apps müssen die nativen Design-Richtlinien befolgen (iOS Human Interface Guidelines, Android Material Design)
- Die wichtigsten Funktionen (Fahrt suchen, Fahrt anbieten) müssen innerhalb von maximal 3 Taps erreichbar sein
- Erstnutzer sollen die Mobile Apps ohne Tutorial intuitiv bedienen können
- Fehlermeldungen müssen verständlich und hilfreich sein (z.B. "Keine Fahrten gefunden. Versuche einen späteren Zeitpunkt.")
- Die Mobile Apps müssen in Hoch- und Querformat nutzbar sein
- Das Web-Admin-Portal muss auf Desktop-Bildschirmen (1920x1080) ohne horizontales Scrollen nutzbar sein

### Barrierefreiheit
- Die Mobile Apps müssen iOS VoiceOver und Android TalkBack unterstützen
- Alle interaktiven Elemente müssen ausreichend groß sein (min. 44x44pt auf iOS, 48x48dp auf Android)
- Der Farbkontrast muss WCAG 2.1 Level AA entsprechen (min. 4.5:1)
- Alle Informationen müssen auch ohne Farbe erkennbar sein
- Das Web-Admin-Portal muss vollständig per Tastatur bedienbar sein

### Wartbarkeit
- Der Quellcode des Backend Servers muss modular aufgebaut und gut dokumentiert sein
- Alle API-Endpoints müssen mit OpenAPI/Swagger dokumentiert sein
- Die Mobile Apps müssen automatisierte Unit-Tests (min. 70% Code Coverage) haben
- Das System muss Logging für alle kritischen Operationen implementieren (Winston für Node.js)
- Updates der Mobile Apps sollen über App Store / Google Play verteilt werden ohne Downtime des Backend Servers
- Das Database Schema muss Migrations-Unterstützung bieten (z.B. mit Sequelize oder TypeORM)

### Zuverlässigkeit
- Alle Fahrtangebote und Buchungen müssen durch Database-Transaktionen atomar gespeichert werden
- Bei Ausfall des Pusher-Services müssen Benachrichtigungen als Fallback per E-Mail versendet werden
- Das Backend Server System muss automatische Backups der PostgreSQL Database durchführen (täglich, Aufbewahrung 30 Tage)
- Bei fehlgeschlagenen API-Calls müssen die Mobile Apps automatisch Retry-Mechanismen mit exponential backoff implementieren

### Testbarkeit
- Alle Software-Komponenten müssen in isolierten Testumgebungen (Development, Staging, Production) deploybar sein
- Das Backend Server System muss Mock-Versionen der Partner-Elemente für Tests unterstützen
- Die Mobile Apps müssen automatisierte UI-Tests ermöglichen (XCUITest für iOS, Espresso für Android)

## Constraints

### Rechtliche Constraints

#### DSGVO (Datenschutz-Grundverordnung)
- Alle Nutzer müssen vor der ersten Nutzung der Datenschutzerklärung zustimmen
- Das System muss das Recht auf Auskunft, Berichtigung, Löschung und Datenportabilität gewährleisten
- Ein Datenschutzbeauftragter der Hochschule muss benannt werden
- Bei Datenpannen muss innerhalb von 72 Stunden die zuständige Aufsichtsbehörde informiert werden
- Datenverarbeitung außerhalb der EU (z.B. durch Pusher) erfordert geeignete Garantien (EU-Standardvertragsklauseln)

#### Personenbeförderungsgesetz
- Die Plattform darf keine gewerbliche Personenbeförderung ermöglichen
- Kostenerstattung darf nur die tatsächlichen Fahrtkosten decken (kein Gewinn)
- Es darf keine Vermittlungsprovision durch die Plattform erhoben werden

#### Hochschulrecht
- Die Integration mit dem Hochschul-Authentifizierungssystem muss von der Hochschulleitung genehmigt werden
- Verwendung von Hochschul-Branding (Logo, Farben) muss abgestimmt sein
- Die Nutzung der Plattform ist ausschließlich für Studierende der Hochschule erlaubt

#### Haftung
- Die Nutzungsbedingungen müssen einen Haftungsausschluss für die Studierendenvertretung enthalten
- Nutzer müssen bestätigen, dass sie über eine gültige KFZ-Haftpflichtversicherung verfügen (Fahrer)

### Organisatorische Constraints

#### Budget
- Die Entwicklungskosten für Native Apps (iOS und Android separat) sind höher als für Cross-Platform-Lösungen
- Laufende Kosten für Pusher müssen im Budget der Studierendenvertretung berücksichtigt werden
- Kosten für Kartendienste (Google Maps API) müssen geprüft werden (evtl. kostenloses Kontingent ausreichend)
- On-Premise Hosting reduziert laufende Cloud-Kosten, erfordert aber IT-Personal für Wartung

#### Zeitrahmen
- Entwicklung nativer Apps für iOS und Android dauert länger als Cross-Platform-Lösung
- Mindestens 6-9 Monate Entwicklungszeit für MVP (Minimum Viable Product) einplanen
- Beta-Phase mit begrenzter Nutzergruppe (ca. 50-100 Studierende) vor vollständigem Launch empfohlen
- Launch idealerweise zum Semesterbeginn planen für maximale Nutzerakzeptanz

#### Ressourcen
- Hochschul-IT muss OAuth/SAML-Schnittstelle für das Hochschul-Authentifizierungssystem bereitstellen
- Hochschul-IT muss Hochschul-Server mit ausreichenden Ressourcen zur Verfügung stellen
- Hochschul-IT muss Wartung und Updates des Hochschul-Servers durchführen
- Studierendenvertretung muss Support für Nutzer und Administration leisten können
- Entwicklungsteam benötigt:
  - Mindestens 1 iOS-Entwickler (Swift)
  - Mindestens 1 Android-Entwickler (Kotlin)
  - Mindestens 1 Backend-Entwickler (Node.js)
  - 1 UI/UX-Designer
  - Optional: 1 DevOps-Engineer für Deployment und Monitoring

#### Betrieb
- 24/7-Monitoring des Hochschul-Servers erforderlich
- Support-Erreichbarkeit während Vorlesungszeiten erforderlich
- Regelmäßige Updates der Mobile Apps über App Store und Google Play Store
- Moderation von Support-Anfragen und Konflikten durch Studierendenvertretung

### Technische Constraints

#### Plattformen und Versionen
- iOS Mobile App muss iOS 14 oder höher unterstützen (Swift 5.5+)
- Android Mobile App muss Android 8.0 (API Level 26) oder höher unterstützen (Kotlin 1.5+)
- Backend Server muss auf Node.js 18 LTS oder höher laufen
- PostgreSQL Database Version 14 oder höher erforderlich
- Web-Admin-Portal muss in modernen Browsern funktionieren (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

#### Schnittstellen zu Partner-Elementen
- Hochschul-Authentifizierungssystem muss OAuth 2.0 oder SAML 2.0 unterstützen
- Apple Maps API erfordert Apple Developer Account und API-Key
- Google Maps API erfordert Google Cloud Project und API-Key (mit aktivierter Billing)
- Pusher erfordert kostenpflichtigen Account (mind. "Startup"-Plan für 500+ gleichzeitige Verbindungen)
- PayPal API erfordert PayPal Business Account und API-Credentials

#### Hosting und Infrastruktur
- Hochschul-Server muss Linux-basiert sein (Ubuntu Server 22.04 LTS empfohlen)
- Server muss über Firewall abgesichert sein (nur Ports 80, 443 nach außen geöffnet)
- Server muss im Hochschul-Netzwerk mit fester IP-Adresse oder DNS-Name erreichbar sein
- SSL/TLS-Zertifikat muss vorhanden sein (z.B. Let's Encrypt)
- Backup-System muss vorhanden sein (täglich automatisierte Backups)
- Monitoring-System empfohlen (z.B. Prometheus + Grafana)

#### Deployment
- iOS Mobile App muss über Apple App Store verteilt werden (erfordert Apple Developer Program - 99€/Jahr)
- Android Mobile App muss über Google Play Store verteilt werden (erfordert Google Play Developer Account - einmalig 25$)
- Apps müssen App Store Guidelines und Google Play Policies erfüllen
- Backend Server kann mit PM2 oder Docker als Process Manager betrieben werden
- CI/CD-Pipeline empfohlen (z.B. GitHub Actions für automatisierte Tests und Deployment)

#### Datenbank
- PostgreSQL Database muss auf demselben Hochschul-Server wie Backend Server laufen
- Datenbankverbindung muss über SSL erfolgen
- Connection Pooling muss implementiert sein (z.B. mit node-postgres)
- Regelmäßige Database Backups über pg_dump

#### Entwicklung
- Version Control über Git erforderlich (z.B. GitHub oder GitLab)
- Code-Reviews vor Merge in main branch empfohlen
- Branching-Strategy definieren (z.B. GitFlow)
- Separate Umgebungen für Development, Staging und Production

#### API-Limits
- Google Maps API: Free Tier bis 28.000 Map Loads/Monat, danach kostenpflichtig
- Pusher: Je nach Plan limitierte Anzahl gleichzeitiger Verbindungen und Nachrichten/Tag
- PayPal API: Transaktionsgebühren pro Zahlung (ca. 2,49% + 0,35€)

---

*Dokument erstellt am: 19. Januar 2026*
*Version: 1.0 (Entwurf)*
