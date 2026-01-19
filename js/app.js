/**
 * CampusRide - Mobile App für Mitfahrgelegenheiten
 * LOW TECH EDITION - Plausibilitätsprüfung statt GPS-Tracking
 *
 * Implementiert nach Response2.md:
 * - G-01: Verifizierte Mobilität (Plausibilität)
 * - G-02: Barrierefreier "Walled Garden" (Shibboleth)
 * - G-03: Datenschutzfreundliche Routenführung
 * - G-04: Offline-First Zuverlässigkeit
 *
 * - UI-01: Dashboard & Ride Matcher
 * - UI-02: Active Ride Mode (Low Tech)
 * - UI-03: Wallet & History
 *
 * - UC-01: Fahrt validieren (Plausibilitäts-Check)
 * - TF-01: Offline Token Generator
 * - TF-02: Plausibility Pre-Check (Client Side)
 * - TF-03: Snapshot Locator
 */

// ==================== SERVER TIME (C-01 Constraint) ====================
const ServerTime = {
    offset: 0,

    async sync() {
        // In Produktion: NTP oder Server-Zeit abrufen
        // Hier: Simulation mit lokaler Zeit
        this.offset = 0;
    },

    now() {
        return Date.now() + this.offset;
    },

    timestamp() {
        return Math.floor(this.now() / 1000);
    }
};

// ==================== ENTITIES ====================

/**
 * E-01 - Local Ride Cache
 * Speichert Fahrtdaten temporär bis zum Upload
 */
const LocalRideCache = {
    KEY: 'campusride_ridecache',

    create(data) {
        const rides = this.getAll();
        const ride = {
            rideId: data.rideId || generateUUID(),
            startTime: data.startTime || ServerTime.timestamp(),
            endTime: null,
            endGeo: null,
            syncStatus: 'Pending',
            expectedDuration: data.expectedDuration || 30 * 60, // 30 min default
            expectedDistance: data.expectedDistance || 12, // 12 km default
            from: data.from || 'Start',
            to: data.to || 'Ziel',
            partnerName: data.partnerName || 'Mitfahrer',
            partnerStudy: data.partnerStudy || 'Student'
        };
        rides.push(ride);
        localStorage.setItem(this.KEY, JSON.stringify(rides));
        return ride;
    },

    getActive() {
        const rides = this.getAll();
        return rides.find(r => r.endTime === null);
    },

    getAll() {
        const data = localStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : [];
    },

    update(rideId, updates) {
        const rides = this.getAll();
        const index = rides.findIndex(r => r.rideId === rideId);
        if (index !== -1) {
            rides[index] = { ...rides[index], ...updates };
            localStorage.setItem(this.KEY, JSON.stringify(rides));
            return rides[index];
        }
        return null;
    },

    getPending() {
        return this.getAll().filter(r => r.syncStatus === 'Pending' && r.endTime !== null);
    },

    markUploaded(rideId) {
        this.update(rideId, { syncStatus: 'Uploaded' });
    },

    clear() {
        localStorage.removeItem(this.KEY);
    }
};

/**
 * E-02 - User Profile Settings
 */
const UserProfile = {
    KEY: 'campusride_profile',

    save(data) {
        const profile = {
            ...this.get(),
            ...data,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem(this.KEY, JSON.stringify(profile));
    },

    get() {
        const data = localStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : {
            userId: generateUUID(),
            userName: 'Student',
            userRole: 'Student',
            university: '',
            study: '',
            karma: 5.0,
            credits: 0,
            maxDetour: 10,
            privacyLevel: 'Standard',
            accessibility: false,
            iban: '',
            vehicle: ''
        };
    },

    clear() {
        localStorage.removeItem(this.KEY);
    },

    isLoggedIn() {
        return this.get().university !== '';
    },

    updateCredits(credits) {
        this.save({ credits });
    },

    updateKarma(karma) {
        this.save({ karma: Math.max(0, Math.min(5, karma)) });
    }
};

/**
 * Ride History Storage
 */
const RideHistory = {
    KEY: 'campusride_history',

    add(ride) {
        const history = this.getAll();
        history.unshift({
            id: ride.id || generateUUID(),
            from: ride.from,
            to: ride.to,
            date: new Date().toISOString(),
            duration: ride.duration,
            distance: ride.distance || 12,
            credits: ride.credits,
            validated: ride.validated,
            status: ride.status || 'validated'
        });
        localStorage.setItem(this.KEY, JSON.stringify(history.slice(0, 50)));
    },

    getAll() {
        const data = localStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : [];
    },

    getTotalCredits() {
        return this.getAll().reduce((sum, ride) => sum + (ride.credits || 0), 0);
    },

    getTotalKm() {
        return this.getAll().reduce((sum, ride) => sum + (ride.distance || 0), 0);
    }
};

// ==================== TECHNICAL FUNCTIONS ====================

/**
 * TF-01 - Offline Token Generator
 * Generiert signierte QR-Codes ohne Netzverbindung
 */
const OfflineTokenGenerator = {
    SECRET: null,

    init() {
        // Secret wird beim Login gespeichert
        this.SECRET = UserProfile.get().userId || generateUUID();
    },

    generateCode(rideId) {
        const timestamp = ServerTime.timestamp();
        const payload = {
            rideId,
            timestamp,
            signature: this.sign(rideId + timestamp)
        };
        return btoa(JSON.stringify(payload));
    },

    verify(codeString) {
        try {
            const payload = JSON.parse(atob(codeString));

            // Prüfe Signatur
            const expectedSignature = this.sign(payload.rideId + payload.timestamp);
            if (payload.signature !== expectedSignature) {
                return { valid: false, rideId: null, error: 'Ungültige Signatur' };
            }

            // Prüfe Timestamp (max 5 Minuten alt)
            const age = ServerTime.timestamp() - payload.timestamp;
            const maxAge = 5 * 60; // 5 Minuten in Sekunden
            if (age > maxAge) {
                return { valid: false, rideId: null, error: 'QR-Code abgelaufen (>5 Min)' };
            }

            return { valid: true, rideId: payload.rideId, timestamp: payload.timestamp, error: null };
        } catch (e) {
            return { valid: false, rideId: null, error: 'Ungültiger QR-Code' };
        }
    },

    sign(data) {
        let hash = 0;
        const str = data + this.SECRET;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }
};

/**
 * TF-02 - Plausibility Pre-Check (Client Side)
 * Prüft VOR dem Upload, ob Fahrt plausibel ist
 */
const PlausibilityCheck = {
    /**
     * @param {number} startTime - Unix timestamp (seconds)
     * @param {number} endTime - Unix timestamp (seconds)
     * @param {number} expectedDuration - Expected duration in seconds
     * @param {number} expectedDistance - Expected distance in km
     * @returns {object} { plausible: boolean, reason: string }
     */
    check(startTime, endTime, expectedDuration, expectedDistance) {
        const actualDuration = endTime - startTime;

        // Mindestdauer: 50% der erwarteten Zeit
        const minDuration = expectedDuration * 0.5;

        // Teleportations-Check: Ist es physikalisch möglich?
        // Annahme: Max 150 km/h Durchschnittsgeschwindigkeit
        const maxSpeed = 150; // km/h
        const minPossibleTime = (expectedDistance / maxSpeed) * 3600; // in Sekunden

        if (actualDuration < minPossibleTime) {
            return {
                plausible: false,
                reason: `Teleportation erkannt: ${expectedDistance}km in ${Math.round(actualDuration / 60)} Min nicht möglich`,
                flag: 'TELEPORTATION'
            };
        }

        if (actualDuration < minDuration) {
            return {
                plausible: false,
                reason: `Fahrt zu kurz: ${Math.round(actualDuration / 60)} Min statt erwarteter ${Math.round(expectedDuration / 60)} Min`,
                flag: 'TOO_SHORT'
            };
        }

        return {
            plausible: true,
            reason: 'Fahrt plausibel',
            flag: 'OK'
        };
    }
};

/**
 * TF-03 - Snapshot Locator
 * Nimmt einen einmaligen GPS-Snapshot beim Beenden
 */
const SnapshotLocator = {
    async getSnapshot() {
        return new Promise((resolve) => {
            if (!('geolocation' in navigator)) {
                resolve({ success: false, error: 'GPS nicht verfügbar', data: null });
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        success: true,
                        error: null,
                        data: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            timestamp: ServerTime.timestamp()
                        }
                    });
                },
                (error) => {
                    // GPS nicht verfügbar (z.B. Tiefgarage)
                    resolve({
                        success: false,
                        error: 'Location Missing - GPS nicht verfügbar',
                        data: null
                    });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }
};

// ==================== OFFLINE SYNC ====================

const OfflineSync = {
    async syncPendingRides() {
        if (!navigator.onLine) {
            return { synced: 0, pending: LocalRideCache.getPending().length };
        }

        const pending = LocalRideCache.getPending();
        let synced = 0;

        for (const ride of pending) {
            // Simuliere Server-Upload
            await new Promise(resolve => setTimeout(resolve, 500));

            // Markiere als hochgeladen
            LocalRideCache.markUploaded(ride.rideId);
            synced++;
        }

        return { synced, pending: 0 };
    },

    init() {
        // Sync wenn online
        window.addEventListener('online', () => {
            showSyncBanner();
            this.syncPendingRides().then(() => {
                hideSyncBanner();
                showToast('Daten synchronisiert', '✅');
            });
        });

        window.addEventListener('offline', () => {
            showOfflineBanner();
        });

        // Initial check
        if (!navigator.onLine) {
            showOfflineBanner();
        }
    }
};

// ==================== HELPER FUNCTIONS ====================

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatTime(date) {
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

// ==================== APP STATE ====================

const AppState = {
    currentScreen: 'login',
    currentRole: null,
    currentRide: null,
    rideTimer: null,
    rideSeconds: 0,
    rideStartTime: null
};

// ==================== SCREEN NAVIGATION ====================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    const screen = document.getElementById(`screen-${screenId}`);
    if (screen) {
        screen.classList.add('active');
        AppState.currentScreen = screenId;
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.screen === screenId) {
            item.classList.add('active');
        }
    });
}

// ==================== UI HELPERS ====================

function showToast(message, icon = 'ℹ️', duration = 3000) {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toast-icon');
    const toastMessage = document.getElementById('toast-message');

    toastIcon.textContent = icon;
    toastMessage.textContent = message;
    toast.style.display = 'flex';

    setTimeout(() => {
        toast.style.display = 'none';
    }, duration);
}

function showOfflineBanner() {
    document.getElementById('offline-banner').style.display = 'flex';
}

function hideOfflineBanner() {
    document.getElementById('offline-banner').style.display = 'none';
}

function showSyncBanner() {
    document.getElementById('sync-banner').style.display = 'flex';
}

function hideSyncBanner() {
    document.getElementById('sync-banner').style.display = 'none';
}

// ==================== QR CODE GENERATION ====================

function generateQRCodeCanvas(data, container) {
    container.innerHTML = '';

    const canvas = document.createElement('canvas');
    canvas.width = 180;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 180, 180);

    ctx.fillStyle = '#000000';
    const moduleSize = 6;
    const modules = 25;
    const offset = (180 - modules * moduleSize) / 2;

    drawFinderPattern(ctx, offset, offset, moduleSize);
    drawFinderPattern(ctx, offset + (modules - 7) * moduleSize, offset, moduleSize);
    drawFinderPattern(ctx, offset, offset + (modules - 7) * moduleSize, moduleSize);

    const hash = simpleHash(data);
    for (let row = 0; row < modules; row++) {
        for (let col = 0; col < modules; col++) {
            if ((row < 8 && col < 8) || (row < 8 && col >= modules - 8) || (row >= modules - 8 && col < 8)) {
                continue;
            }
            const bitIndex = row * modules + col;
            if ((hash.charCodeAt(bitIndex % hash.length) + bitIndex) % 3 === 0) {
                ctx.fillRect(offset + col * moduleSize, offset + row * moduleSize, moduleSize, moduleSize);
            }
        }
    }

    container.appendChild(canvas);

    const codeText = document.createElement('p');
    codeText.className = 'qr-code-text';
    codeText.style.cssText = 'font-size: 0.6rem; word-break: break-all; margin-top: 8px; color: #64748b; text-align: center;';
    codeText.textContent = `Gültig für 5 Min`;
    container.appendChild(codeText);
}

function drawFinderPattern(ctx, x, y, size) {
    ctx.fillRect(x, y, 7 * size, size);
    ctx.fillRect(x, y + 6 * size, 7 * size, size);
    ctx.fillRect(x, y, size, 7 * size);
    ctx.fillRect(x + 6 * size, y, size, 7 * size);
    ctx.fillRect(x + 2 * size, y + 2 * size, 3 * size, 3 * size);
}

function simpleHash(str) {
    let hash = '';
    for (let i = 0; i < str.length; i++) {
        hash += String.fromCharCode((str.charCodeAt(i) * 31 + i) % 128 + 32);
    }
    return hash.repeat(10);
}

// ==================== RIDE TIMER ====================

function startRideTimer() {
    AppState.rideSeconds = 0;
    AppState.rideStartTime = ServerTime.timestamp();
    updateTimerDisplay();

    AppState.rideTimer = setInterval(() => {
        AppState.rideSeconds++;
        updateTimerDisplay();
    }, 1000);
}

function stopRideTimer() {
    if (AppState.rideTimer) {
        clearInterval(AppState.rideTimer);
        AppState.rideTimer = null;
    }
}

function updateTimerDisplay() {
    const display = formatDuration(AppState.rideSeconds);
    const timerEl = document.getElementById('ride-timer');
    if (timerEl) {
        timerEl.textContent = display;
    }
}

// ==================== MOCK DATA ====================

const SmartMeetingPoints = [
    { id: 1, name: 'Bushaltestelle Campus Nord', distance: '150m', radius: 200 },
    { id: 2, name: 'P+R Parkplatz Bibliothek', distance: '200m', radius: 200 },
    { id: 3, name: 'Mensa Haupteingang', distance: '300m', radius: 200 },
    { id: 4, name: 'S-Bahn Station Uni', distance: '450m', radius: 200 }
];

const MockRides = [
    {
        id: 'r1', from: 'Campus Mitte', to: 'Hauptbahnhof', time: '14:30',
        seats: 2, driver: 'Max M.', rating: 4.8, study: 'Informatik, 4. Semester',
        vehicle: 'VW Golf · Grau · B-XY 1234', distance: 12, duration: 35
    },
    {
        id: 'r2', from: 'P+R Nord', to: 'Campus West', time: '14:45',
        seats: 1, driver: 'Lisa S.', rating: 4.9, study: 'BWL, 3. Semester',
        vehicle: 'Toyota Yaris · Blau · B-AB 5678', distance: 8, duration: 20
    },
    {
        id: 'r3', from: 'Bibliothek', to: 'S-Bahn Westkreuz', time: '15:00',
        seats: 3, driver: 'Tom K.', rating: 4.7, study: 'Maschinenbau, 6. Semester',
        vehicle: 'Opel Corsa · Rot · B-CD 9012', distance: 15, duration: 40
    }
];

// ==================== SEARCH & MATCHING ====================

function showMeetingPoints() {
    const container = document.getElementById('meeting-points');
    const list = document.getElementById('points-list');

    list.innerHTML = SmartMeetingPoints.map(point => `
        <div class="point-card" data-point-id="${point.id}">
            <span class="point-icon">📍</span>
            <div class="point-info">
                <span class="point-name">${point.name}</span>
                <span class="point-distance">${point.distance} · Radius ${point.radius}m</span>
            </div>
        </div>
    `).join('');

    container.style.display = 'block';

    list.querySelectorAll('.point-card').forEach(card => {
        card.addEventListener('click', () => {
            list.querySelectorAll('.point-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            showToast('Treffpunkt ausgewählt', '✅');
        });
    });
}

function showSearchResults() {
    const container = document.getElementById('search-results');
    const list = document.getElementById('results-list');

    list.innerHTML = MockRides.map(ride => `
        <div class="result-card" data-ride-id="${ride.id}">
            <div class="ride-info" style="flex: 1;">
                <div class="ride-route">
                    <span class="ride-from">${ride.from}</span>
                    <span class="ride-arrow">→</span>
                    <span class="ride-to">${ride.to}</span>
                </div>
                <div class="ride-meta" style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">
                    <span>🕐 ${ride.time}</span> ·
                    <span>👤 ${ride.driver}</span> ·
                    <span>⭐${ride.rating}</span> ·
                    <span>💺 ${ride.seats} frei</span>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
                    ${ride.vehicle}
                </div>
            </div>
            <button class="btn btn-small btn-primary btn-request">Anfragen</button>
        </div>
    `).join('');

    container.style.display = 'block';

    list.querySelectorAll('.btn-request').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.result-card');
            const rideId = card.dataset.rideId;
            const ride = MockRides.find(r => r.id === rideId);

            if (ride) {
                AppState.currentRide = ride;
                showMatchScreen(ride);
            }
        });
    });
}

function showMatchScreen(ride) {
    document.getElementById('match-name').textContent = ride.driver;
    document.getElementById('match-details').textContent = ride.study;
    document.getElementById('match-start').textContent = ride.from;
    document.getElementById('match-end').textContent = ride.to;
    document.getElementById('match-time').textContent = ride.time + ' Uhr';
    document.getElementById('vehicle-info').querySelector('.vehicle-text').textContent = ride.vehicle;

    // ETA berechnen
    const now = new Date();
    const [hours, mins] = ride.time.split(':').map(Number);
    const departureTime = new Date(now);
    departureTime.setHours(hours, mins, 0);
    const arrivalTime = new Date(departureTime.getTime() + ride.duration * 60000);

    document.getElementById('match-eta').textContent = `~${formatTime(arrivalTime)} Uhr`;
    document.getElementById('match-distance').textContent = `~${ride.distance} km`;

    showScreen('match');
    showToast('Match gefunden!', '🎉');
}

// ==================== RIDE FLOW (LOW TECH) ====================

function startRideMode() {
    const ride = AppState.currentRide;
    const rideId = generateUUID();

    // Erstelle Ride im Local Cache
    LocalRideCache.create({
        rideId,
        from: ride?.from || 'Start',
        to: ride?.to || 'Ziel',
        expectedDuration: (ride?.duration || 30) * 60,
        expectedDistance: ride?.distance || 12,
        partnerName: ride?.driver || 'Mitfahrer',
        partnerStudy: ride?.study || 'Student'
    });

    AppState.currentRide = {
        ...ride,
        id: rideId
    };

    showScreen('ride');

    document.getElementById('ride-qr-section').style.display = 'flex';
    document.getElementById('ride-active-section').style.display = 'none';
    document.getElementById('ride-complete-section').style.display = 'none';
}

function generatePassengerQR() {
    const activeRide = LocalRideCache.getActive();
    if (!activeRide) {
        showToast('Keine aktive Fahrt', '❌');
        return;
    }

    OfflineTokenGenerator.init();
    const qrCode = OfflineTokenGenerator.generateCode(activeRide.rideId);
    const qrDisplay = document.getElementById('qr-display');

    generateQRCodeCanvas(qrCode, qrDisplay);
    qrDisplay.dataset.code = qrCode;

    document.getElementById('qr-info').textContent = 'Zeige diesen Code dem Fahrer (gültig für 5 Min)';

    showToast('QR-Code generiert (Offline-fähig)', '📱');
}

function openScanner() {
    document.getElementById('modal-scanner').style.display = 'flex';
}

function closeScanner() {
    document.getElementById('modal-scanner').style.display = 'none';
}

function demoScan() {
    // Simuliere erfolgreichen Scan
    const qrDisplay = document.getElementById('qr-display');
    const code = qrDisplay.dataset.code;

    if (code) {
        processQRCode(code);
    } else {
        // Generiere Demo-Code
        const activeRide = LocalRideCache.getActive();
        if (activeRide) {
            OfflineTokenGenerator.init();
            const demoCode = OfflineTokenGenerator.generateCode(activeRide.rideId);
            processQRCode(demoCode);
        } else {
            showToast('Bitte zuerst QR-Code generieren', '❌');
        }
    }
}

function processQRCode(code) {
    OfflineTokenGenerator.init();
    const result = OfflineTokenGenerator.verify(code);

    if (result.valid) {
        showToast('Check-In erfolgreich!', '✅');
        closeScanner();

        // Update ride with start timestamp from QR
        const activeRide = LocalRideCache.getActive();
        if (activeRide) {
            LocalRideCache.update(activeRide.rideId, {
                startTime: result.timestamp || ServerTime.timestamp()
            });
        }

        startActiveRide();
    } else {
        showToast(result.error || 'Ungültiger Code', '❌');
    }
}

function startActiveRide() {
    document.getElementById('ride-qr-section').style.display = 'none';
    document.getElementById('ride-active-section').style.display = 'flex';
    document.getElementById('ride-complete-section').style.display = 'none';

    // Zeige Partner-Info
    const activeRide = LocalRideCache.getActive();
    if (activeRide) {
        document.getElementById('ride-partner-name').textContent = activeRide.partnerName;
        document.getElementById('ride-partner-study').textContent = activeRide.partnerStudy;
        document.getElementById('active-from').textContent = activeRide.from;
        document.getElementById('active-to').textContent = activeRide.to;

        // ETA berechnen
        const arrivalTime = new Date(Date.now() + activeRide.expectedDuration * 1000);
        document.getElementById('active-eta').textContent = `~${formatTime(arrivalTime)} Uhr`;
    }

    startRideTimer();

    showToast('Fahrt gestartet - Energiesparmodus aktiv 🔋', '🚗');
}

async function endRide() {
    stopRideTimer();

    const activeRide = LocalRideCache.getActive();
    if (!activeRide) {
        showToast('Keine aktive Fahrt gefunden', '❌');
        return;
    }

    // TF-03: GPS Snapshot beim Beenden
    showToast('Ermittle Standort...', '📍');
    const snapshot = await SnapshotLocator.getSnapshot();

    const endTime = ServerTime.timestamp();

    // Update ride
    LocalRideCache.update(activeRide.rideId, {
        endTime,
        endGeo: snapshot.data
    });

    // UI umschalten
    document.getElementById('ride-qr-section').style.display = 'none';
    document.getElementById('ride-active-section').style.display = 'none';
    document.getElementById('ride-complete-section').style.display = 'flex';

    // Stats anzeigen
    document.getElementById('complete-duration').textContent = formatDuration(AppState.rideSeconds);
    document.getElementById('complete-distance').textContent = `~${activeRide.expectedDistance} km`;

    // TF-02: Plausibilitätsprüfung
    simulateValidation(activeRide, endTime);
}

function simulateValidation(ride, endTime) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const statusEl = document.getElementById('complete-status');
    const backBtn = document.getElementById('btn-back-dashboard');
    const warningBox = document.getElementById('plausibility-warning');

    // Plausibilitätsprüfung durchführen
    const check = PlausibilityCheck.check(
        ride.startTime,
        endTime,
        ride.expectedDuration,
        ride.expectedDistance
    );

    const steps = [
        { progress: 25, text: 'Zeitstempel werden geprüft...' },
        { progress: 50, text: 'Plausibilitätsprüfung läuft...' },
        { progress: 75, text: 'Daten werden synchronisiert...' },
        { progress: 100, text: 'Validierung abgeschlossen!' }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
        if (stepIndex < steps.length) {
            const step = steps[stepIndex];
            progressFill.style.width = step.progress + '%';
            progressText.textContent = step.text;
            stepIndex++;
        } else {
            clearInterval(interval);

            if (check.plausible) {
                // Fahrt erfolgreich
                statusEl.textContent = '✅ Validiert';
                statusEl.style.color = '#22c55e';
                warningBox.style.display = 'none';

                // Credits berechnen (basierend auf Distanz)
                const credits = Math.round(ride.expectedDistance * 2);
                const profile = UserProfile.get();
                UserProfile.updateCredits(profile.credits + credits);

                // Zur Historie hinzufügen
                RideHistory.add({
                    id: ride.rideId,
                    from: ride.from,
                    to: ride.to,
                    duration: AppState.rideSeconds,
                    distance: ride.expectedDistance,
                    credits: credits,
                    validated: true,
                    status: 'validated'
                });

                LocalRideCache.markUploaded(ride.rideId);

                showToast(`+${credits} Credits erhalten!`, '🎉');
            } else {
                // Fahrt abgelehnt
                statusEl.textContent = '❌ Abgelehnt';
                statusEl.style.color = '#ef4444';

                warningBox.style.display = 'flex';
                warningBox.querySelector('.warning-text').textContent = check.reason;

                // Karma senken
                const profile = UserProfile.get();
                UserProfile.updateKarma(profile.karma - 0.2);

                // Zur Historie (als fehlgeschlagen)
                RideHistory.add({
                    id: ride.rideId,
                    from: ride.from,
                    to: ride.to,
                    duration: AppState.rideSeconds,
                    distance: ride.expectedDistance,
                    credits: 0,
                    validated: false,
                    status: check.flag
                });

                showToast('Fahrt konnte nicht validiert werden', '⚠️');
            }

            backBtn.style.display = 'block';
        }
    }, 800);
}

function handleEmergency() {
    showToast('Campus-Security wird benachrichtigt!', '🆘', 5000);
    // In Produktion: Direkte Nummer anrufen oder Standort senden
}

// ==================== WALLET & HISTORY ====================

function updateWalletScreen() {
    const profile = UserProfile.get();
    const history = RideHistory.getAll();

    // Wallet Card
    document.getElementById('wallet-credits').textContent = profile.credits;
    document.getElementById('wallet-estimate').textContent = `~ ${(profile.credits * 0.15).toFixed(2)} €`;
    document.getElementById('wallet-karma').textContent = `⭐ ${profile.karma.toFixed(1)}`;

    // Summary
    document.getElementById('total-rides').textContent = history.length;
    document.getElementById('total-credits').textContent = RideHistory.getTotalCredits();
    document.getElementById('total-km').textContent = RideHistory.getTotalKm();

    // IBAN
    document.getElementById('iban-input').value = profile.iban || '';

    // History List
    const list = document.getElementById('history-list');

    if (history.length === 0) {
        list.innerHTML = `
            <div class="history-empty">
                <span class="empty-icon">📋</span>
                <p>Noch keine Fahrten vorhanden</p>
            </div>
        `;
        return;
    }

    list.innerHTML = history.map(ride => {
        const date = new Date(ride.date);
        const dateStr = date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        const icon = ride.validated ? '✅' : '❌';
        const creditsDisplay = ride.validated ? `+${ride.credits}` : '0';
        const creditsClass = ride.validated ? 'history-credits' : '';

        return `
            <div class="history-item">
                <div class="history-icon">${icon}</div>
                <div class="history-details">
                    <span class="history-route">${ride.from} → ${ride.to}</span>
                    <span class="history-date">${dateStr} · ${ride.distance || 0} km</span>
                </div>
                <span class="${creditsClass}">${creditsDisplay}</span>
            </div>
        `;
    }).join('');
}

function updateDashboard() {
    const profile = UserProfile.get();
    document.getElementById('user-name').textContent = profile.userName;
    document.getElementById('credits-display').textContent = profile.credits;
    document.getElementById('karma-display').textContent = `⭐ ${profile.karma.toFixed(1)}`;
}

// ==================== INITIALIZATION ====================

function initApp() {
    // Server Time sync
    ServerTime.sync();

    // Offline Sync init
    OfflineSync.init();

    // Token Generator init
    OfflineTokenGenerator.init();

    // Event Listeners

    // Login
    document.getElementById('btn-login').addEventListener('click', handleLogin);
    document.getElementById('password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    // Logout
    document.getElementById('btn-logout').addEventListener('click', handleLogout);

    // Quick Match
    document.getElementById('btn-quick-match').addEventListener('click', () => {
        AppState.currentRole = 'passenger';
        AppState.currentRide = MockRides[0]; // Default ride
        showMatchScreen(MockRides[0]);
    });

    // Role Selection
    document.getElementById('btn-passenger').addEventListener('click', () => {
        AppState.currentRole = 'passenger';
        document.getElementById('search-title').textContent = 'Fahrt suchen';
        document.getElementById('driver-options').style.display = 'none';
        showScreen('search');
    });

    document.getElementById('btn-driver').addEventListener('click', () => {
        AppState.currentRole = 'driver';
        document.getElementById('search-title').textContent = 'Fahrt anbieten';
        document.getElementById('driver-options').style.display = 'block';
        showScreen('search');
    });

    // Departures click
    document.querySelectorAll('.departure-card').forEach(card => {
        card.addEventListener('click', () => {
            const destination = card.querySelector('.departure-destination').textContent.replace('→ ', '');
            const driver = card.querySelector('.departure-driver').textContent;
            const time = card.querySelector('.departure-time').textContent;

            AppState.currentRide = {
                from: 'Aktueller Standort',
                to: destination,
                time,
                driver: driver.split(' · ')[0],
                vehicle: driver,
                distance: 10,
                duration: 25,
                study: 'Student',
                rating: 4.5
            };

            showMatchScreen(AppState.currentRide);
        });
    });

    // Back Buttons
    document.getElementById('btn-back-search').addEventListener('click', () => showScreen('dashboard'));
    document.getElementById('btn-back-match').addEventListener('click', () => showScreen('search'));
    document.getElementById('btn-back-wallet').addEventListener('click', () => showScreen('dashboard'));

    // Search
    document.getElementById('btn-search-rides').addEventListener('click', () => {
        showMeetingPoints();
        setTimeout(() => showSearchResults(), 300);
        showToast('Suche läuft...', '🔍');
    });

    document.getElementById('btn-gps').addEventListener('click', () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                () => {
                    document.getElementById('input-start').value = 'Aktueller Standort';
                    showToast('Standort ermittelt', '📍');
                },
                () => showToast('Standort nicht verfügbar', '❌')
            );
        }
    });

    // Match Screen
    document.getElementById('btn-navigate').addEventListener('click', () => {
        showToast('Öffne Google Maps...', '🗺️');
        // In Produktion: Deep Link zu Maps App
    });

    document.getElementById('btn-start-ride').addEventListener('click', startRideMode);

    // Ride Screen
    document.getElementById('btn-generate-qr').addEventListener('click', generatePassengerQR);
    document.getElementById('btn-scan-qr').addEventListener('click', openScanner);
    document.getElementById('btn-close-scanner').addEventListener('click', closeScanner);
    document.getElementById('btn-demo-scan').addEventListener('click', demoScan);
    document.getElementById('btn-end-ride').addEventListener('click', endRide);
    document.getElementById('btn-emergency').addEventListener('click', handleEmergency);
    document.getElementById('btn-back-dashboard').addEventListener('click', () => {
        updateDashboard();
        showScreen('dashboard');
    });

    // Wallet
    document.getElementById('btn-save-iban').addEventListener('click', () => {
        const iban = document.getElementById('iban-input').value;
        UserProfile.save({ iban });
        showToast('IBAN gespeichert', '✅');
    });

    document.getElementById('btn-export-pdf').addEventListener('click', () => {
        showToast('PDF wird generiert...', '📄');
        setTimeout(() => showToast('PDF-Export simuliert', '✅'), 1500);
    });

    // Bottom Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const screen = item.dataset.screen;
            if (screen === 'wallet') {
                updateWalletScreen();
            }
            showScreen(screen);
        });
    });

    // Set default time
    const timeInput = document.getElementById('input-time');
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    timeInput.value = now.toISOString().slice(0, 16);

    // Check login status
    if (UserProfile.isLoggedIn()) {
        updateDashboard();
        showScreen('dashboard');
    } else {
        showScreen('login');
    }
}

function handleLogin() {
    const uni = document.getElementById('uni-select').value;
    const email = document.getElementById('uni-email').value;
    const password = document.getElementById('password').value;

    if (!uni) {
        showToast('Bitte Hochschule auswählen', '❌');
        return;
    }

    if (!email || !password) {
        showToast('Bitte alle Felder ausfüllen', '❌');
        return;
    }

    // Simuliere Shibboleth Login
    const userName = email.split('@')[0].split('.')[0];

    UserProfile.save({
        userName: userName.charAt(0).toUpperCase() + userName.slice(1),
        userRole: 'Student',
        university: uni,
        study: 'Informatik',
        karma: 5.0,
        credits: Math.floor(Math.random() * 30) + 10
    });

    OfflineTokenGenerator.init();

    showToast('Erfolgreich über Shibboleth eingeloggt!', '✅');
    updateDashboard();
    showScreen('dashboard');
}

function handleLogout() {
    UserProfile.clear();
    LocalRideCache.clear();
    showToast('Ausgeloggt', '👋');
    showScreen('login');
}

// Start App
document.addEventListener('DOMContentLoaded', initApp);
