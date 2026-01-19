# Solution Design Concept: Campus-Mitfahrgelegenheiten-App

## Vision
Studierende der Hochschule sollen durch eine verlässliche, sichere und benutzerfreundliche Mitfahrgelegenheiten-Plattform die Möglichkeit erhalten, gemeinsam zum Campus zu fahren. Dies reduziert die Verkehrsbelastung, schont die Umwelt, verringert Parkplatzprobleme und fördert die soziale Vernetzung unter Studierenden. Die Lösung ersetzt unzuverlässige WhatsApp-Gruppen durch eine strukturierte, vertrauenswürdige Plattform.

## Value Proposition

### Kundensegment 1: Studierende mit Auto (Fahrer)
**Jobs to be Done:**
- Benzinkosten durch Kostenteilung reduzieren
- Parkplatzsuche erleichtern (eventuell Vorteile für Fahrgemeinschaften)
- Soziale Kontakte während der Fahrt knüpfen
- Umweltbewusstes Handeln demonstrieren

**Value Proposition:**
Die App ermöglicht es Fahrern, ihre regelmäßigen Fahrten zum Campus mit anderen Studierenden zu teilen und dabei die Fahrtkosten fair aufzuteilen. Durch das Verifizierungssystem über den Hochschul-Account wird Sicherheit gewährleistet. Das Bewertungssystem sorgt für Vertrauen und zuverlässige Mitfahrer.

### Kundensegment 2: Studierende ohne Auto (Mitfahrer)
**Jobs to be Done:**
- Kostengünstige Alternative zu öffentlichen Verkehrsmitteln oder eigenem Auto finden
- Flexibel und spontan zum Campus gelangen
- Zuverlässige Fahrtmöglichkeiten für regelmäßige Vorlesungstermine sicherstellen
- Soziale Kontakte knüpfen

**Value Proposition:**
Die App bietet Zugang zu regelmäßigen und spontanen Mitfahrgelegenheiten zum Campus. Durch transparente Kostenangaben, Bewertungen und die Verifizierung aller Nutzer über den Hochschul-Account entsteht eine vertrauensvolle und sichere Umgebung für Fahrgemeinschaften.

### Kundensegment 3: Studierendenvertretung (Auftraggeber)
**Jobs to be Done:**
- Service für Studierende verbessern
- Parkplatzprobleme auf dem Campus reduzieren
- Nachhaltigkeit fördern
- Gemeinschaftsgefühl unter Studierenden stärken

**Value Proposition:**
Die Plattform bietet eine strukturierte Lösung für das Verkehrsproblem am Campus, reduziert die Anzahl der Einzelfahrten und fördert die Gemeinschaft unter Studierenden.

## Value Creation Architecture

### **Architektur 1: Zentrale Plattform mit integriertem Backend (Basisansatz)**

#### Akteure

##### Studierende (Fahrer & Mitfahrer)
- Nutzen die Smartphone-App zur Organisation von Fahrten
- Erstellen Fahrtangebote oder suchen nach passenden Fahrten
- Bewerten sich gegenseitig nach Fahrten
- Kommunizieren über die App

##### Studierendenvertretung
- Betreibt und finanziert die Plattform
- Definiert Nutzungsregeln
- Hat Zugriff auf anonymisierte Statistiken
- Moderiert bei Konflikten

##### Hochschul-IT
- Stellt Schnittstelle zur Verifizierung von Hochschul-Accounts bereit
- Gewährleistet Integration mit bestehenden Systemen

##### Zahlungsdienstleister
- Wickelt Zahlungen zwischen Nutzern ab
- PayPal

#### Digitale Elemente

##### Smartphone-App (iOS & Android)
- Hauptinterface für Studierende
- Funktionen:
  - Fahrtangebote erstellen und suchen
  - Buchung von Mitfahrgelegenheiten
  - Echtzeit-Kommunikation zwischen Fahrer und Mitfahrer
  - Routenanzeige und Navigation
  - Bewertungssystem
  - Push-Benachrichtigungen
  - Profilverwaltung

##### Web-Portal (Administration)
- Interface für Studierendenvertretung
- Funktionen:
  - Dashboard mit Nutzungsstatistiken
  - Nutzerverwaltung
  - Konfliktmanagement
  - Konfiguration von Systemparametern

##### Backend-System
- Zentrale Datenverwaltung
- Matching-Algorithmus für Fahrten
- Benachrichtigungsdienst
- Schnittstelle zur Hochschul-IT
- Routenoptimierung bei mehreren Mitfahrenden
- Kostenberechnungsmodul

##### Hochschul-Authentifizierungssystem
- Verifizierung der Studierenden über Hochschul-Account
- SSO (Single Sign-On) Integration

---

## Information Architecture

### Business Entity: Nutzerprofil
**Attribute:**
- Nutzer-ID (eindeutig)
- Name (Vor- und Nachname)
- Hochschul-E-Mail-Adresse
- Matrikelnummer (nur zur Verifizierung, nicht öffentlich sichtbar)
- Profilbild (optional)
- Telefonnummer (optional, für Notfälle)
- Studiengang (optional, für soziale Vernetzung)
- Verifizierungsstatus (verifiziert/nicht verifiziert)
- Bewertungsdurchschnitt (0-5 Sterne)
- Anzahl absolvierter Fahrten
- Präferenzen (Musik, Rauchen, Gesprächigkeit)
- Registrierungsdatum
- Status (aktiv/inaktiv/gesperrt)

### Business Entity: Fahrtangebot
**Attribute:**
- Fahrt-ID (eindeutig)
- Fahrer-ID (Referenz zu Nutzerprofil)
- Startadresse
- Zieladresse (Campus)
- Zwischenstopps (optional, Liste von Adressen)
- Abfahrtsdatum und -uhrzeit
- Ankunftsdatum und -uhrzeit (geschätzt)
- Anzahl verfügbarer Plätze
- Kosten pro Mitfahrer (Betrag in EUR) - manuell
- Fahrttyp (einmalig/regelmäßig)
- Bei regelmäßigen Fahrten: Wiederholungsmuster (z.B. jeden Montag, Mittwoch)
- Routeninformationen (GPS-Koordinaten)
- Status (offen/gebucht/abgeschlossen/storniert)
- Besondere Hinweise (z.B. "Platz für Gepäck", "Hund an Bord")
- Erstellungsdatum

### Business Entity: Buchung
**Attribute:**
- Buchungs-ID (eindeutig)
- Fahrt-ID (Referenz zu Fahrtangebot)
- Mitfahrer-ID (Referenz zu Nutzerprofil)
- Einstiegsadresse (kann von Startadresse abweichen)
- Ausstiegsadresse (kann vom Ziel abweichen)
- Buchungsdatum und -uhrzeit
- Status (angefragt/bestätigt/abgelehnt/abgeschlossen/storniert)
- Kosten für diesen Mitfahrer
- Zahlungsstatus (offen/bezahlt)
- Bestätigungscode (für Check-in)

### Business Entity: Bewertung
**Attribute:**
- Bewertungs-ID (eindeutig)
- Buchungs-ID (Referenz zu Buchung)
- Bewerter-ID (Nutzer, der bewertet)
- Bewerteter-ID (Nutzer, der bewertet wird)
- Sterne (1-5)
- Kommentar (optional)
- Kategorien (Pünktlichkeit, Freundlichkeit, Fahrstil/Verhalten)
- Bewertungsdatum
- Status (sichtbar/gemeldet/ausgeblendet)

### Business Entity: Nachricht
**Attribute:**
- Nachrichten-ID (eindeutig)
- Absender-ID (Referenz zu Nutzerprofil)
- Empfänger-ID (Referenz zu Nutzerprofil)
- Fahrt-ID (optionale Referenz zu Fahrtangebot)
- Nachrichtentext
- Zeitstempel
- Gelesen-Status (gelesen/ungelesen)

### Business Entity: Benachrichtigung
**Attribute:**
- Benachrichtigungs-ID (eindeutig)
- Nutzer-ID (Empfänger)
- Typ (Buchungsanfrage/Bestätigung/Erinnerung/Systemnachricht)
- Titel
- Nachricht
- Referenz-ID (z.B. Buchungs-ID)
- Zeitstempel
- Gelesen-Status
- Push-Benachrichtigung gesendet (ja/nein)

## Business Processes

### Prozess 1: Registrierung und Verifizierung

1. **Studierende** öffnet die **Smartphone-App** und wählt "Registrieren"
2. **Smartphone-App** leitet zur **Hochschul-Authentifizierung** weiter
3. **Studierende** meldet sich mit Hochschul-Account (Benutzername und Passwort) an
4. **Hochschul-Authentifizierungssystem** validiert die Anmeldedaten und übermittelt Matrikelnummer und E-Mail an das **Backend-System**
5. **Backend-System** erstellt **Nutzerprofil** mit Verifizierungsstatus "verifiziert"
6. **Studierende** vervollständigt Profil (Präferenzen, Profilbild, etc.)
7. **Smartphone-App** zeigt Bestätigung der erfolgreichen Registrierung

### Prozess 2: Fahrtangebot erstellen (Fahrer)

1. **Fahrer** öffnet die **Smartphone-App** und wählt "Fahrt anbieten"
2. **Smartphone-App** zeigt Formular für Fahrtdetails
3. **Fahrer** gibt Startadresse, Campus als Ziel, Abfahrtszeit, verfügbare Plätze ein
4. **Fahrer** legt fest, ob Fahrt einmalig oder regelmäßig ist (bei regelmäßig: Wiederholungsmuster)
5. **Fahrer** legt Kosten pro Mitfahrer selbst fest, bekommt aber einen Vorschlag des Backendsystems
6. **Fahrer** kann optional Zwischenstopps und Präferenzen hinzufügen
7. **Fahrer** bestätigt das **Fahrtangebot**
8. **Backend-System** speichert das **Fahrtangebot** und aktiviert es
9. **Backend-System** sendet **Benachrichtigung** an passende **Studierende**, die nach ähnlichen Fahrten suchen
10. **Smartphone-App** zeigt Bestätigung und Übersicht des erstellten Angebots

### Prozess 3: Mitfahrgelegenheit suchen und buchen (Mitfahrer)

1. **Mitfahrer** öffnet die **Smartphone-App** und wählt "Fahrt suchen"
2. **Mitfahrer** gibt Startort, Zielort (Campus) und gewünschte Zeit ein
3. **Backend-System** durchsucht verfügbare **Fahrtangebote** und zeigt passende Ergebnisse
4. **Smartphone-App** zeigt Liste mit passenden Fahrten inkl. Fahrerinfo, Bewertung, Kosten, Abfahrtszeit
5. **Mitfahrer** wählt ein **Fahrtangebot** aus und sieht Detailansicht
6. **Mitfahrer** kann optional Einstiegsort anpassen (falls Route entsprechende Zwischenstopps erlaubt)
7. **Mitfahrer** klickt auf "Mitfahrt anfragen"
8. **Backend-System** erstellt **Buchung** mit Status "angefragt"
9. **Backend-System** sendet **Benachrichtigung** an **Fahrer**
10. **Fahrer** erhält Push-Benachrichtigung und öffnet Buchungsanfrage in **Smartphone-App**
11. **Fahrer** prüft Profil des **Mitfahrers** (Bewertung, bisherige Fahrten)
12. **Fahrer** bestätigt oder lehnt die Buchungsanfrage ab
13. **Backend-System** aktualisiert **Buchung**-Status auf "bestätigt" oder "abgelehnt"
14. **Backend-System** sendet **Benachrichtigung** an **Mitfahrer**
15. Bei Bestätigung: **Smartphone-App** zeigt Fahrtdetails und Kontaktmöglichkeit zum **Fahrer**

### Prozess 4: Durchführung der Fahrt

1. Am Fahrtag: **Backend-System** sendet Erinnerungs-**Benachrichtigung** an **Fahrer** und alle **Mitfahrer** (z.B. 30 Minuten vor Abfahrt)
2. **Fahrer** und **Mitfahrer** können über **Nachricht**-Funktion in der **Smartphone-App** kommunizieren
3. Bei Verspätung oder Änderungen: **Fahrer** kann Status-Update in **Smartphone-App** senden
4. **Backend-System** sendet automatische **Benachrichtigung** über Status-Updates an alle betroffenen **Mitfahrer**
5. Bei Treffpunkt: **Fahrer** und **Mitfahrer** identifizieren sich über **Nutzerprofil** (Profilbild) oder Bestätigungscode
6. Optional: **Mitfahrer** bestätigt Fahrtantritt in **Smartphone-App** (Check-in)
7. **Fahrer** nutzt optionale Navigationsunterstützung der **Smartphone-App** für optimale Route
8. Nach Ankunft am Campus: **Fahrer** markiert Fahrt als "abgeschlossen" in **Smartphone-App**
9.  Bei App-integrierter Zahlung: **Backend-System** veranlasst automatische Zahlungsabwicklung über **Zahlungsdienstleister**
10. **Backend-System** aktualisiert alle **Buchungen** der Fahrt auf Status "abgeschlossen"

### Prozess 5: Gegenseitige Bewertung

1. Nach abgeschlossener Fahrt: **Backend-System** sendet **Benachrichtigung** an **Fahrer** und **Mitfahrer** mit Bitte um Bewertung
2. **Studierende** öffnet **Smartphone-App** und navigiert zu abgeschlossenen Fahrten
3. **Studierende** wählt die Fahrt aus und klickt auf "Bewerten"
4. **Smartphone-App** zeigt Bewertungsformular
5. **Studierende** vergibt Sterne (1-5) und optional Bewertungen für Kategorien (Pünktlichkeit, Freundlichkeit, Fahrstil/Verhalten)
6. **Studierende** kann optional einen Kommentar hinzufügen
7. **Studierende** sendet **Bewertung** ab
8. **Backend-System** speichert **Bewertung** und aktualisiert den Bewertungsdurchschnitt im **Nutzerprofil** des bewerteten Nutzers
9. **Backend-System** sendet **Benachrichtigung** an bewerteten Nutzer
10. **Smartphone-App** zeigt neue Bewertung im Profil des bewerteten Nutzers an (sichtbar für andere Nutzer)

### Prozess 6: Regelmäßige Fahrgemeinschaft organisieren

1. **Fahrer** erstellt **Fahrtangebot** mit Fahrttyp "regelmäßig" und definiert Wiederholungsmuster (z.B. jeden Montag und Mittwoch, 08:00 Uhr)
2. **Backend-System** generiert automatisch einzelne **Fahrtangebot**-Instanzen für die nächsten Wochen
3. **Mitfahrer** bucht eine der regelmäßigen Fahrten
4. **Smartphone-App** bietet **Mitfahrer** Option "Für alle zukünftigen Fahrten dieser Serie buchen"
5. **Mitfahrer** wählt diese Option
6. **Backend-System** erstellt automatisch **Buchungen** für alle zukünftigen Fahrten der Serie
7. **Backend-System** sendet wöchentliche Erinnerungs-**Benachrichtigung** an alle Beteiligten
8. Bei Änderungen: **Fahrer** kann einzelne Fahrten absagen oder die gesamte Serie anpassen
9. **Backend-System** sendet automatisch **Benachrichtigungen** an alle betroffenen **Mitfahrer**
10. **Mitfahrer** können einzelne Fahrten stornieren ohne die gesamte Serie zu beenden

### Prozess 7: Konfliktmanagement und Support

1. **Studierende** meldet Problem (z.B. unzuverlässiger Nutzer, unangemessenes Verhalten) über **Smartphone-App**
2. **Backend-System** erstellt Support-Ticket und benachrichtigt **Studierendenvertretung** über **Web-Portal**
3. **Studierendenvertretung** prüft den Fall im **Web-Portal** (inkl. Buchungshistorie, Bewertungen, Kommunikation)
4. **Studierendenvertretung** kontaktiert betroffene **Studierende** über **Nachricht**-System
5. **Studierendenvertretung** trifft Entscheidung (Verwarnung, vorübergehende Sperrung, dauerhafte Sperrung)
6. **Backend-System** aktualisiert **Nutzerprofil**-Status entsprechend
7. **Backend-System** sendet **Benachrichtigung** an betroffene **Studierende**

## Quality Requirements

### Zuverlässigkeit
- Die App muss eine Verfügbarkeit von mindestens 99% während der Vorlesungszeiten gewährleisten
- Fahrtangebote und Buchungen müssen persistent gespeichert werden und dürfen nicht verloren gehen
- Push-Benachrichtigungen müssen zuverlässig zugestellt werden (insbesondere bei kurzfristigen Änderungen)

### Sicherheit
- Alle Nutzer müssen über Hochschul-Account verifiziert sein
- Persönliche Daten (insbesondere Adressen und Telefonnummern) dürfen nur für berechtigte Nutzer sichtbar sein
- Kommunikation zwischen App und Backend muss verschlüsselt erfolgen (HTTPS/TLS)
- Bei Zahlungsintegration: PCI-DSS-Konformität erforderlich

### Datenschutz
- Standortdaten dürfen nur während aktiver Fahrten erhoben werden und müssen nach Fahrtende gelöscht werden (außer Start-/Zielort)
- Nutzerdaten müssen gemäß DSGVO verarbeitet werden
- Nutzer müssen jederzeit ihre Daten einsehen und löschen können
- Anonymisierte Statistiken für Studierendenvertretung dürfen keine Rückschlüsse auf einzelne Personen zulassen

### Benutzerfreundlichkeit (Usability)
- Die wichtigsten Funktionen (Fahrt suchen, Fahrt anbieten) müssen innerhalb von maximal 3 Klicks erreichbar sein
- Erstnutzer sollen die App ohne Anleitung intuitiv nutzen können
- Die App muss barrierefrei gestaltet sein (WCAG 2.1 Level AA)
- Ladezeiten für Suchergebnisse dürfen maximal 2 Sekunden betragen

### Performance
- Die App muss auch bei 1000+ gleichzeitigen Nutzern performant bleiben
- Der Matching-Algorithmus soll passende Fahrten innerhalb von 2 Sekunden finden
- Push-Benachrichtigungen sollen innerhalb von 10 Sekunden nach Auslösung zugestellt werden

### Wartbarkeit
- Der Code muss gut dokumentiert und modular aufgebaut sein
- Updates der App sollen ohne Downtime eingespielt werden können
- Neue Features sollen ohne komplette Neuentwicklung integrierbar sein

## Constraints

### Rechtliche Constraints

#### DSGVO (Datenschutz-Grundverordnung)
- Einwilligung zur Datenverarbeitung muss eingeholt werden
- Recht auf Auskunft, Berichtigung und Löschung muss gewährleistet sein
- Datenschutzerklärung muss verfügbar sein
- Bei Standortdaten: Zweckbindung und Datensparsamkeit beachten

#### Personenbeförderungsgesetz
- Mitfahrgelegenheiten ohne Gewinnerzielungsabsicht sind erlaubt
- Kosten dürfen nur die tatsächlichen Ausgaben decken (keine gewerbliche Personenbeförderung)
- Keine Vermittlungsprovision durch die Plattform (Non-Profit-Modell)

#### Hochschul-Nutzungsbedingungen
- Integration mit Hochschul-IT muss Sicherheitsrichtlinien einhalten
- Verwendung von Hochschul-Logos/Branding muss genehmigt werden

#### Haftung
- Nutzer müssen Haftungsausschluss akzeptieren (Studierendenvertretung haftet nicht für Unfälle oder Schäden)
- Versicherung der Fahrer (KFZ-Haftpflicht) muss gültig sein

### Organisatorische Constraints

#### Budget
- Entwicklung und Betrieb müssen im Budget der Studierendenvertretung liegen
- Bei begrenztem Budget: Priorisierung von Kernfunktionen (MVP - Minimum Viable Product)

#### Zeitrahmen
- Lösung soll idealerweise zum Semesterbeginn verfügbar sein
- Schrittweise Einführung möglich (zunächst Beta-Phase mit kleiner Nutzergruppe)

#### Ressourcen
- Wartung und Support müssen von Studierendenvertretung oder beauftragter Agentur geleistet werden können
- Hochschul-IT muss Schnittstelle für Authentifizierung bereitstellen

#### Technologie
- App muss für iOS und Android verfügbar sein (Cross-Platform-Entwicklung empfohlen)
- Integration mit vorhandenen Hochschul-Systemen (Single Sign-On) erforderlich

### Technische Constraints

#### Plattformen
- Smartphone-App für iOS (mindestens iOS 14+) und Android (mindestens Android 8+)
- Web-Portal für moderne Browser (Chrome, Firefox, Safari, Edge)

#### Schnittstellen
- Integration mit Hochschul-Authentifizierungssystem (vermutlich LDAP oder OAuth2)
- Integration mit Kartendiensten (OpenStreetMap)
- Integration mit Zahlungsdienstleister (API)

#### Hosting
- Server müssen in EU gehostet werden (DSGVO-Konformität)
- Backup-Strategie muss implementiert sein

---

*Dokument erstellt am: 19. Januar 2026*
*Version: 1.0 (Entwurf)*