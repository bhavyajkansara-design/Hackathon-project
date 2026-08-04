/* ==========================================================================
   OmniCheck AI — Main Application Orchestrator & State Manager
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Instantiate diagnostic scanners
    const ppgScanner = new window.PPGScanner();
    const faceScanner = new window.FaceScanner();
    const audioScanner = new window.AudioScanner();
    const motorScanner = new window.MotorScanner();
    const reportGenerator = new window.ReportGenerator();

    // Central state management
    const state = {
        scores: { cardio: null, ocular: null, respiratory: null, motor: null, overall: null },
        cardio: { bpm: 72, hrv: 52, bpSys: 118, bpDia: 76, spo2: 98, stress: "Optimal" },
        ocular: { hemoglobin: 14.4, palenessStatus: "Normal (14.4 g/dL)", bilirubinStatus: "Normal (Clear Sclera)", symmetry: 98.6, respRate: 16 },
        respiratory: { hydration: 88, jitter: 0.65, shimmer: 1.8, hnr: 22.4, respRate: 16 },
        motor: { tapCount: 68, tps: 6.8, decay: 4.2, dexterity: "Normal (82/100)", reactionMs: 240 },
        guidance: []
    };

    // UI Tab Navigation
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabPanels = document.querySelectorAll('.tab-panel');

    function switchTab(tabId) {
        navTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
        tabPanels.forEach(p => p.classList.toggle('active', p.id === `panel-${tabId}`));

        if (tabId === 'summary') {
            reportGenerator.renderRadarChart(state.scores);
        }
    }

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Demo Banner Toggle
    const btnJudgeDemo = document.getElementById('btnJudgeDemo');
    const demoBanner = document.getElementById('demoBanner');
    const btnCloseDemoBanner = document.getElementById('btnCloseDemoBanner');

    if (btnJudgeDemo && demoBanner) {
        btnJudgeDemo.addEventListener('click', () => {
            demoBanner.style.display = demoBanner.style.display === 'none' ? 'block' : 'none';
        });
    }

    if (btnCloseDemoBanner) {
        btnCloseDemoBanner.addEventListener('click', () => {
            demoBanner.style.display = 'none';
        });
    }

    // Load Simulated Clinical Profile (Judge Demo Mode)
    function loadClinicalProfile(profileKey) {
        const profile = window.SimulationData[profileKey];
        if (!profile) return;

        state.scores = { ...profile.scores };
        state.cardio = { ...profile.cardio };
        state.ocular = { ...profile.ocular };
        state.respiratory = { ...profile.respiratory };
        state.motor = { ...profile.motor };
        state.guidance = [ ...profile.guidance ];

        updateAllOrganCards();
        reportGenerator.renderRadarChart(state.scores);
        reportGenerator.generateClinicalReport(state);

        const btnViewReport = document.getElementById('btnViewReport');
        if (btnViewReport) btnViewReport.disabled = false;

        const lastUpdated = document.getElementById('lastUpdatedTime');
        if (lastUpdated) lastUpdated.textContent = `Demo Profile Loaded: ${profile.name}`;
    }

    document.querySelectorAll('.profile-card').forEach(card => {
        card.addEventListener('click', () => {
            loadClinicalProfile(card.dataset.profile);
        });
    });

    // Update UI telemetry for Organ Scorecard Top Cards
    function updateAllOrganCards() {
        // Cardio
        if (state.scores.cardio !== null) {
            document.getElementById('scoreCardio').textContent = `${state.scores.cardio}/100`;
            document.getElementById('valBpm').textContent = `${state.cardio.bpm} BPM`;
            document.getElementById('valHrv').textContent = `${state.cardio.hrv} ms`;
            document.getElementById('valBp').textContent = `${state.cardio.bpSys}/${state.cardio.bpDia} mmHg`;
            document.getElementById('barCardio').style.width = `${state.scores.cardio}%`;
        }

        // Ocular
        if (state.scores.ocular !== null) {
            document.getElementById('scoreOcular').textContent = `${state.scores.ocular}/100`;
            document.getElementById('valHemoglobin').textContent = `${state.ocular.hemoglobin} g/dL`;
            document.getElementById('valBilirubin').textContent = state.ocular.bilirubinStatus;
            document.getElementById('valSymmetry').textContent = `${state.ocular.symmetry}%`;
            document.getElementById('barOcular').style.width = `${state.scores.ocular}%`;
        }

        // Respiratory
        if (state.scores.respiratory !== null) {
            document.getElementById('scoreRespiratory').textContent = `${state.scores.respiratory}/100`;
            document.getElementById('valHydration').textContent = `${state.respiratory.hydration}%`;
            document.getElementById('valJitter').textContent = `${state.respiratory.jitter}%`;
            document.getElementById('valRespRate').textContent = `${state.respiratory.respRate} BPM`;
            document.getElementById('barRespiratory').style.width = `${state.scores.respiratory}%`;
        }

        // Motor
        if (state.scores.motor !== null) {
            document.getElementById('scoreMotor').textContent = `${state.scores.motor}/100`;
            document.getElementById('valTapSpeed').textContent = `${state.motor.tps} TPS`;
            document.getElementById('valCadence').textContent = `${100 - state.motor.decay}%`;
            document.getElementById('valReaction').textContent = `${state.motor.reactionMs} ms`;
            document.getElementById('barMotor').style.width = `${state.scores.motor}%`;
        }

        // Overall
        if (state.scores.overall !== null) {
            document.getElementById('scoreOverall').textContent = state.scores.overall;
            const badge = document.getElementById('badgeHealthStatus');
            const summary = document.getElementById('textHealthSummary');

            if (state.scores.overall >= 85) {
                badge.className = "health-status-badge text-green";
                badge.textContent = "Optimal Health Telemetry";
                summary.textContent = "All 5 organ systems indicate balanced autonomic resilience and clean non-invasive optical/acoustic biomarkers.";
            } else if (state.scores.overall >= 70) {
                badge.className = "health-status-badge text-amber";
                badge.textContent = "Mild Autonomic / Acoustic Shift";
                summary.textContent = "Elevated stress or reduced vocal hydration detected. Review clinical report for rehydration and rest guidance.";
            } else {
                badge.className = "health-status-badge text-red";
                badge.textContent = "Clinical Triage Alert";
                summary.textContent = "Significant deviation in palpebral hemoglobin, HRV, or vocal perturbation. Clinical CBC consult recommended.";
            }
        }
    }

    // 1. PPG Scanner Controls
    const btnStartPpg = document.getElementById('btnStartPpg');
    const btnSimulatePpg = document.getElementById('btnSimulatePpg');

    ppgScanner.onProgress = (percent) => {
        document.getElementById('ppgProgressPercent').textContent = `${percent}%`;
        document.getElementById('ppgProgressBar').style.width = `${percent}%`;

        document.getElementById('ppgLiveBpm').innerHTML = `${ppgScanner.currentBpm || 72} <small>BPM</small>`;
        document.getElementById('ppgLiveHrv').innerHTML = `${ppgScanner.currentHrv || 48} <small>ms</small>`;
        document.getElementById('ppgLiveSpo2').innerHTML = `${ppgScanner.currentSpo2 || 98} <small>%</small>`;
        document.getElementById('ppgLiveStress').textContent = (ppgScanner.currentHrv || 48) > 50 ? "Resting" : "Elevated";
    };

    ppgScanner.onComplete = (data) => {
        state.cardio = { ...state.cardio, ...data };
        state.scores.cardio = Math.min(100, Math.round(data.hrv * 0.8 + 40));
        recalculateOverallScore();
        updateAllOrganCards();
    };

    if (btnStartPpg) btnStartPpg.addEventListener('click', () => ppgScanner.startCamera());
    if (btnSimulatePpg) btnSimulatePpg.addEventListener('click', () => ppgScanner.startSimulation());

    // 2. Face Scanner Controls
    const btnStartFace = document.getElementById('btnStartFace');
    const btnSimulateFace = document.getElementById('btnSimulateFace');

    faceScanner.onProgress = (percent) => {
        document.getElementById('valPaleness').textContent = `Scanning... (${percent}%)`;
    };

    faceScanner.onComplete = (data) => {
        state.ocular = { ...state.ocular, ...data };
        state.scores.ocular = 92;
        recalculateOverallScore();
        updateAllOrganCards();
    };

    if (btnStartFace) btnStartFace.addEventListener('click', () => faceScanner.startCamera());
    if (btnSimulateFace) btnSimulateFace.addEventListener('click', () => faceScanner.startSimulation());

    // 3. Audio Scanner Controls
    const btnStartAudio = document.getElementById('btnStartAudio');
    const btnSimulateAudio = document.getElementById('btnSimulateAudio');

    audioScanner.onProgress = (elapsedSec) => {
        const timer = document.getElementById('audioTimer');
        if (timer) timer.textContent = `${elapsedSec.toFixed(1)}s / 5.0s`;
    };

    audioScanner.onComplete = (data) => {
        state.respiratory = { ...state.respiratory, ...data };
        state.scores.respiratory = data.hydration;
        document.getElementById('audioJitter').innerHTML = `${data.jitter} <small>%</small>`;
        document.getElementById('audioShimmer').innerHTML = `${data.shimmer} <small>%</small>`;
        document.getElementById('audioHnr').innerHTML = `${data.hnr} <small>dB</small>`;
        document.getElementById('audioHydration').textContent = `${data.hydration}%`;
        recalculateOverallScore();
        updateAllOrganCards();
    };

    if (btnStartAudio) btnStartAudio.addEventListener('click', () => audioScanner.startMicrophone());
    if (btnSimulateAudio) btnSimulateAudio.addEventListener('click', () => audioScanner.startSimulation());

    // 4. Motor Scanner Controls
    const btnStartMotor = document.getElementById('btnStartMotor');
    const btnSimulateMotor = document.getElementById('btnSimulateMotor');

    motorScanner.onProgress = (elapsedSec) => {
        const tapCountEl = document.getElementById('motorTapCount');
        if (tapCountEl) tapCountEl.textContent = motorScanner.taps.length;
    };

    motorScanner.onComplete = (data) => {
        state.motor = { ...state.motor, ...data };
        state.scores.motor = Math.min(100, Math.round(data.tps * 12));
        document.getElementById('motorTps').innerHTML = `${data.tps} <small>TPS</small>`;
        document.getElementById('motorDecay').innerHTML = `${data.decay} <small>%</small>`;
        document.getElementById('motorDexterity').textContent = data.dexterity;
        recalculateOverallScore();
        updateAllOrganCards();
    };

    if (btnStartMotor) btnStartMotor.addEventListener('click', () => motorScanner.startTest());
    if (btnSimulateMotor) btnSimulateMotor.addEventListener('click', () => motorScanner.startSimulation());

    // Recalculate Overall 0-100 Score
    function recalculateOverallScore() {
        const validScores = Object.values(state.scores).filter(s => s !== null);
        if (validScores.length > 0) {
            state.scores.overall = Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length);
        } else {
            state.scores.overall = 85;
        }

        const btnViewReport = document.getElementById('btnViewReport');
        if (btnViewReport) btnViewReport.disabled = false;
        
        reportGenerator.generateClinicalReport(state);
    }

    // Modal Report Interactions
    const modalReport = document.getElementById('modalReport');
    const btnViewReport = document.getElementById('btnViewReport');
    const btnCloseReport = document.getElementById('btnCloseReport');
    const btnCloseReportBtn = document.getElementById('btnCloseReportBtn');
    const btnPrintReport = document.getElementById('btnPrintReport');

    if (btnViewReport) {
        btnViewReport.addEventListener('click', () => {
            reportGenerator.generateClinicalReport(state);
            modalReport.classList.add('active');
        });
    }

    if (btnCloseReport) btnCloseReport.addEventListener('click', () => modalReport.classList.remove('active'));
    if (btnCloseReportBtn) btnCloseReportBtn.addEventListener('click', () => modalReport.classList.remove('active'));

    if (btnPrintReport) {
        btnPrintReport.addEventListener('click', () => {
            window.print();
        });
    }

    // Full Body Scan Automation Sequence
    const btnFullCheckup = document.getElementById('btnFullCheckup');
    let isFullScanRunning = false;

    if (btnFullCheckup) {
        btnFullCheckup.addEventListener('click', async () => {
            if (isFullScanRunning) return;
            isFullScanRunning = true;
            btnFullCheckup.disabled = true;
            btnFullCheckup.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Scanning Full Body...`;

            // Step 1: PPG Cardio Scan
            switchTab('ppg');
            const lastUpdated = document.getElementById('lastUpdatedTime');
            if (lastUpdated) lastUpdated.textContent = "Full Body Scan Step 1/4: Cardio PPG Acquisition...";
            await new Promise(resolve => {
                ppgScanner.onComplete = (data) => {
                    state.cardio = { ...state.cardio, ...data };
                    state.scores.cardio = Math.min(100, Math.round(data.hrv * 0.8 + 40));
                    updateAllOrganCards();
                    resolve();
                };
                ppgScanner.startSimulation();
            });

            // Delay for transition
            await new Promise(r => setTimeout(r, 800));

            // Step 2: Ocular & Facial Scan
            switchTab('vision');
            if (lastUpdated) lastUpdated.textContent = "Full Body Scan Step 2/4: Ocular & Hemoglobin Optical Scan...";
            await new Promise(resolve => {
                faceScanner.onComplete = (data) => {
                    state.ocular = { ...state.ocular, ...data };
                    state.scores.ocular = 94;
                    updateAllOrganCards();
                    resolve();
                };
                faceScanner.startSimulation();
            });

            await new Promise(r => setTimeout(r, 800));

            // Step 3: Vocal & Respiratory Acoustic Scan
            switchTab('audio');
            if (lastUpdated) lastUpdated.textContent = "Full Body Scan Step 3/4: Vocal Cord Acoustic Spectrogram...";
            await new Promise(resolve => {
                audioScanner.onComplete = (data) => {
                    state.respiratory = { ...state.respiratory, ...data };
                    state.scores.respiratory = data.hydration;
                    document.getElementById('audioJitter').innerHTML = `${data.jitter} <small>%</small>`;
                    document.getElementById('audioShimmer').innerHTML = `${data.shimmer} <small>%</small>`;
                    document.getElementById('audioHnr').innerHTML = `${data.hnr} <small>dB</small>`;
                    document.getElementById('audioHydration').textContent = `${data.hydration}%`;
                    updateAllOrganCards();
                    resolve();
                };
                audioScanner.startSimulation();
            });

            await new Promise(r => setTimeout(r, 800));

            // Step 4: Neuromotor Cadence Scan
            switchTab('motor');
            if (lastUpdated) lastUpdated.textContent = "Full Body Scan Step 4/4: Neuromotor Tapping Cadence Test...";
            await new Promise(resolve => {
                motorScanner.onComplete = (data) => {
                    state.motor = { ...state.motor, ...data };
                    state.scores.motor = Math.min(100, Math.round(data.tps * 12));
                    document.getElementById('motorTps').innerHTML = `${data.tps} <small>TPS</small>`;
                    document.getElementById('motorDecay').innerHTML = `${data.decay} <small>%</small>`;
                    document.getElementById('motorDexterity').textContent = data.dexterity;
                    updateAllOrganCards();
                    resolve();
                };
                motorScanner.startSimulation();
            });

            await new Promise(r => setTimeout(r, 800));

            // Step 5: Summary & Report Generation
            recalculateOverallScore();
            updateAllOrganCards();
            switchTab('summary');
            reportGenerator.generateClinicalReport(state);
            
            if (lastUpdated) lastUpdated.textContent = "Full Body Scan Complete — Clinical Telemetry Generated";
            
            // Pop up report modal
            const modalReport = document.getElementById('modalReport');
            if (modalReport) modalReport.classList.add('active');

            btnFullCheckup.disabled = false;
            btnFullCheckup.innerHTML = `<i class="fa-solid fa-play"></i> Start Full Body Scan`;
            isFullScanRunning = false;
        });
    }

    // Initialize with default athletic profile for seamless first view
    loadClinicalProfile('athletic');
});
