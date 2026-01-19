# Solution Design Concept: MitFHargelegenheit

## Vision
MitFHargelegenheit soll den Pendelverkehr zur Fachhochschule Dortmund revolutionieren, indem es eine digitale Plattform für Fahrgemeinschaften unter Studierenden bereitstellt. Die Lösung soll die Umweltbelastung durch reduzierten CO2-Ausstoß senken, die Parkplatzsituation auf dem Campus entlasten und gleichzeitig die soziale Vernetzung unter den Studierenden fördern. Langfristig soll die Plattform auch für Dozenten und Mitarbeiter der Hochschule sowie Partnerunternehmen geöffnet werden.

## Value Proposition

### Studierende als Fahrer
**Wertversprechen:** Studierende, die mit dem eigenen PKW zur FH Dortmund pendeln, erhalten die Möglichkeit, Fahrkosten (Benzin, Verschleiß) durch Mitfahrer zu teilen, leichter einen Parkplatz zu finden (weniger Fahrzeuge auf dem Campus) und neue Kontakte zu knüpfen. Das Bewertungssystem schafft Vertrauen und fördert zuverlässiges Verhalten.

### Studierende als Mitfahrer
**Wertversprechen:** Studierende ohne eigenes Fahrzeug oder mit schlechter ÖPNV-Anbindung erhalten eine flexible, kostengünstige und umweltfreundliche Alternative zur Anreise zur FH Dortmund. Durch das Bewertungssystem können sie vertrauenswürdige Fahrer identifizieren und die Fahrzeit für soziale Kontakte nutzen.

### Fachhochschule Dortmund (als Sponsor/Stakeholder)
**Wertversprechen:** Die FH Dortmund profitiert von einer entlasteten Parkplatzsituation, einem positiven Nachhaltigkeitsimage und einer gestärkten Campus-Community. Die Plattform kann als Vorzeigeprojekt für studentische Innovation dienen.

## Value Creation Architecture

### Kunden/Nutzer
- **Studierende (Fahrer):** Bieten Mitfahrgelegenheiten an
- **Studierende (Mitfahrer):** Nehmen Mitfahrgelegenheiten in Anspruch
- **Dozenten/Mitarbeiter (zukünftig):** Potenzielle Erweiterung der Nutzergruppe

### Organisationen
- **Fachhochschule Dortmund:** Stellt die verifizierte Nutzeridentität über die FH-Mailadresse sicher, tritt potenziell als Sponsor auf
- **IT-Services der FH Dortmund:** Unterstützt ggf. bei der Integration mit bestehenden Hochschulsystemen (z.B. Verifizierung der Studierenden)

### Digitale Elemente
- **MitFHargelegenheit Mobile App (iOS/Android):** Hauptschnittstelle für Nutzer zum Anbieten, Suchen und Buchen von Fahrten sowie zur Bewertungsabgabe
- **MitFHargelegenheit Backend-System:** Verwaltet Nutzerprofile, Fahrten, Buchungen und Bewertungen
- **Benachrichtigungssystem:** Informiert Nutzer über Buchungsanfragen, Bestätigungen und Erinnerungen
- **Kartendienst:** Zeigt Routen und Treffpunkte an (z.B. Integration von OpenStreetMap oder Google Maps)

## Information Architecture

### Nutzerprofil
Das Nutzerprofil erfasst alle relevanten Informationen eines registrierten Nutzers:
- Nutzer-ID (eindeutig)
- Vorname und Nachname
- FH-E-Mail-Adresse (zur Verifizierung)
- Profilbild (optional)
- Telefonnummer (optional, für direkte Kontaktaufnahme)
- Rolle (Fahrer, Mitfahrer, oder beides)
- Durchschnittliche Bewertung (als Fahrer und als Mitfahrer)
- Registrierungsdatum
- Verifizierungsstatus (FH-Zugehörigkeit bestätigt: ja/nein)

### Fahrzeug
Die Entität Fahrzeug erfasst Informationen über die Fahrzeuge der Fahrer:
- Fahrzeug-ID
- Nutzer-ID (Besitzer)
- Fahrzeugtyp/Modell
- Farbe
- Kennzeichen (für Erkennung am Treffpunkt)
- Anzahl verfügbarer Sitzplätze

### Fahrtangebot
Das Fahrtangebot beschreibt eine angebotene Mitfahrgelegenheit:
- Fahrt-ID
- Fahrer (Nutzer-ID)
- Fahrzeug-ID
- Startort (Adresse oder Koordinaten)
- Zielort (FH-Standort: Emil-Figge-Straße, Sonnenstraße, Max-Ophüls-Platz)
- Abfahrtsdatum und -uhrzeit
- Anzahl freier Plätze
- Kostenbeitrag pro Mitfahrer (optional)
- Regelmäßigkeit (einmalig, täglich, wöchentlich an bestimmten Tagen)
- Umwege akzeptiert (ja/nein)
- Status (offen, voll, abgeschlossen, storniert)

### Buchung
Die Buchung verknüpft Mitfahrer mit Fahrtangeboten:
- Buchungs-ID
- Fahrt-ID
- Mitfahrer (Nutzer-ID)
- Anzahl gebuchter Plätze
- Buchungszeitpunkt
- Status (angefragt, bestätigt, abgelehnt, storniert, abgeschlossen)
- Treffpunkt (falls abweichend vom Startort)

### Bewertung
Die Bewertung ermöglicht gegenseitiges Feedback:
- Bewertungs-ID
- Buchungs-ID (Referenz zur abgeschlossenen Fahrt)
- Bewertender Nutzer (Nutzer-ID)
- Bewerteter Nutzer (Nutzer-ID)
- Bewertungspunkte (1-5 Sterne)
- Kommentar (optional)
- Bewertungskategorien (Pünktlichkeit, Freundlichkeit, Fahrstil/Zuverlässigkeit)
- Bewertungszeitpunkt

### FH-Standort
Die Entität FH-Standort erfasst die Zielorte an der FH Dortmund:
- Standort-ID
- Name (z.B. "Campus Emil-Figge-Straße", "Campus Sonnenstraße")
- Adresse
- Koordinaten

## Business Processes

### Registrierung und Verifizierung
1. Der Nutzer lädt die MitFHargelegenheit App auf sein Smartphone herunter.
2. Der Nutzer registriert sich mit seiner FH-Dortmund-E-Mail-Adresse.
3. Das Backend-System sendet eine Verifizierungs-E-Mail an die FH-Adresse.
4. Der Nutzer bestätigt seine E-Mail-Adresse über den Verifizierungslink.
5. Der Nutzer vervollständigt sein Nutzerprofil (Name, optional Profilbild und Telefonnummer).
6. Falls der Nutzer als Fahrer agieren möchte, fügt er sein Fahrzeug hinzu.

### Fahrt anbieten
1. Der Fahrer öffnet die MitFHargelegenheit App und wählt "Fahrt anbieten".
2. Der Fahrer gibt den Startort, den FH-Standort als Zielort, Datum, Uhrzeit und Anzahl freier Plätze ein.
3. Der Fahrer legt optional einen Kostenbeitrag fest und gibt an, ob Umwege möglich sind.
4. Der Fahrer kann die Fahrt als einmalig oder regelmäßig (z.B. jeden Montag und Mittwoch) markieren.
5. Das Backend-System speichert das Fahrtangebot und macht es für potenzielle Mitfahrer suchbar.

### Mitfahrgelegenheit suchen und buchen
1. Der Mitfahrer öffnet die MitFHargelegenheit App und wählt "Fahrt suchen".
2. Der Mitfahrer gibt seinen Startbereich, den gewünschten FH-Standort, Datum und ungefähre Uhrzeit ein.
3. Das Backend-System zeigt passende Fahrtangebote an, sortiert nach Entfernung und Bewertung des Fahrers.
4. Der Mitfahrer wählt ein passendes Fahrtangebot und sendet eine Buchungsanfrage.
5. Das Benachrichtigungssystem informiert den Fahrer über die Buchungsanfrage.
6. Der Fahrer prüft das Profil und die Bewertung des Mitfahrers und bestätigt oder lehnt die Anfrage ab.
7. Das Benachrichtigungssystem informiert den Mitfahrer über die Entscheidung.
8. Bei Bestätigung wird die Buchung im Backend-System gespeichert und die Anzahl freier Plätze reduziert.

### Fahrt durchführen
1. Das Benachrichtigungssystem sendet am Vortag oder einige Stunden vor der Fahrt eine Erinnerung an Fahrer und Mitfahrer.
2. Der Fahrer und die Mitfahrer treffen sich am vereinbarten Treffpunkt zur angegebenen Zeit.
3. Die Fahrt wird gemeinsam zur FH Dortmund durchgeführt.
4. Nach Ankunft am FH-Standort markiert der Fahrer die Fahrt als abgeschlossen.
5. Das Backend-System aktualisiert den Status der Fahrt und der zugehörigen Buchungen auf "abgeschlossen".

### Gegenseitige Bewertung abgeben
1. Nach Abschluss der Fahrt sendet das Benachrichtigungssystem eine Aufforderung zur Bewertung an Fahrer und Mitfahrer.
2. Der Mitfahrer öffnet die MitFHargelegenheit App und bewertet den Fahrer (Sterne für Pünktlichkeit, Freundlichkeit, Fahrstil; optionaler Kommentar).
3. Der Fahrer öffnet die MitFHargelegenheit App und bewertet den Mitfahrer (Sterne für Pünktlichkeit, Freundlichkeit, Zuverlässigkeit; optionaler Kommentar).
4. Das Backend-System speichert die Bewertungen und aktualisiert die Durchschnittsbewertungen in den Nutzerprofilen.
5. Die Bewertungen werden in den jeweiligen Profilen angezeigt und dienen zukünftigen Nutzern als Entscheidungshilfe.

### Fahrt stornieren
1. Der Fahrer oder Mitfahrer öffnet die MitFHargelegenheit App und wählt die gebuchte Fahrt aus.
2. Der Nutzer wählt "Fahrt/Buchung stornieren" und gibt optional einen Grund an.
3. Das Backend-System aktualisiert den Status der Buchung bzw. Fahrt.
4. Das Benachrichtigungssystem informiert alle betroffenen Nutzer über die Stornierung.
5. Bei häufigen kurzfristigen Stornierungen kann dies in der Bewertung des Nutzers berücksichtigt werden.

## Quality Requirements

### Benutzerfreundlichkeit
Die App muss intuitiv bedienbar sein, sodass Studierende ohne Einarbeitung Fahrten anbieten und buchen können. Die Kernfunktionen (Fahrt suchen, Fahrt anbieten) sollen mit maximal drei Klicks erreichbar sein.

### Zuverlässigkeit
Das System muss eine hohe Verfügbarkeit aufweisen, insbesondere zu Stoßzeiten (morgens 7-9 Uhr, nachmittags 16-18 Uhr). Buchungsbestätigungen und Benachrichtigungen müssen zeitnah (innerhalb von Sekunden) zugestellt werden.

### Vertrauenswürdigkeit
Durch die FH-E-Mail-Verifizierung und das Bewertungssystem muss ein hohes Maß an Vertrauen zwischen den Nutzern geschaffen werden. Nur verifizierte Nutzer können die Plattform nutzen.

### Datenschutz
Persönliche Daten der Nutzer müssen vertraulich behandelt werden. Kontaktdaten (z.B. Telefonnummer) werden nur nach erfolgreicher Buchungsbestätigung zwischen Fahrer und Mitfahrer geteilt.

### Skalierbarkeit
Die Lösung muss initial für ca. 15.000 Studierende der FH Dortmund ausgelegt sein und später auf weitere Nutzergruppen (Dozenten, Mitarbeiter) erweiterbar sein.

### Performance
Die Suche nach Mitfahrgelegenheiten muss innerhalb von 2 Sekunden Ergebnisse liefern. Die App soll auch bei schlechter Internetverbindung (z.B. in der U-Bahn) grundlegende Informationen zu gebuchten Fahrten anzeigen können.

## Constraints

### Datenschutzrechtliche Vorgaben (DSGVO)
Die Verarbeitung personenbezogener Daten muss den Anforderungen der Datenschutz-Grundverordnung entsprechen. Es ist eine Einwilligung zur Datenverarbeitung einzuholen, und Nutzer müssen ihre Daten einsehen und löschen können.

### FH-Zugehörigkeit
Die Nutzung der Plattform ist auf Mitglieder der FH Dortmund beschränkt. Die Verifizierung erfolgt über die FH-E-Mail-Adresse (@fh-dortmund.de oder @stud.fh-dortmund.de).

### Keine kommerzielle Gewinnerzielung
MitFHargelegenheit dient der Kostenverteilung, nicht der Gewinnerzielung. Die Kostenbeiträge dürfen nur die tatsächlichen Fahrtkosten (Benzin, Verschleiß) decken und keine Personenbeförderung im gewerblichen Sinne darstellen.

### Haftungsausschluss
Die Plattform vermittelt lediglich Kontakte zwischen Fahrern und Mitfahrern. Die Haftung für Unfälle oder Schäden während der Fahrt liegt beim Fahrer bzw. dessen Kfz-Versicherung. Dies muss den Nutzern transparent kommuniziert werden.

### Freiwilligkeit
Die Nutzung der Plattform ist freiwillig. Es besteht kein Anspruch auf eine Mitfahrgelegenheit, und Fahrer können Buchungsanfragen ohne Angabe von Gründen ablehnen.

### Barrierefreiheit
Die App soll grundlegende Barrierefreiheitsstandards erfüllen, um auch Studierenden mit Einschränkungen die Nutzung zu ermöglichen.
