/* ==========================================================================
   OmniCheck AI — Report Generator & 5-Axis Radar Canvas Engine
   ========================================================================== */

class ReportGenerator {
    constructor() {
        this.radarCanvas = document.getElementById('canvasRadar');
        this.radarCtx = this.radarCanvas ? this.radarCanvas.getContext('2d') : null;
        this.reportModal = document.getElementById('modalReport');
        this.reportContainer = document.getElementById('printableReportContent');
    }

    renderRadarChart(scores) {
        if (!this.radarCtx) return;
        const containerWidth = this.radarCanvas.parentElement ? this.radarCanvas.parentElement.clientWidth : 450;
        const w = Math.min(450, Math.max(280, containerWidth - 20));
        const h = Math.min(380, Math.max(280, containerWidth - 20));
        
        this.radarCanvas.width = w;
        this.radarCanvas.height = h;

        const cx = w / 2;
        const cy = h / 2 + 10;
        const radius = Math.min(120, w * 0.28);

        this.radarCtx.clearRect(0, 0, w, h);

        const categories = [
            { label: "Cardio (PPG)", score: scores.cardio || 75, color: "#00f2fe" },
            { label: "Ocular/Anemia", score: scores.ocular || 80, color: "#00f5a0" },
            { label: "Respiratory", score: scores.respiratory || 70, color: "#a855f7" },
            { label: "Neuromotor", score: scores.motor || 85, color: "#f59e0b" },
            { label: "Autonomic Balance", score: Math.round(((scores.cardio + scores.respiratory) / 2)) || 78, color: "#ff007f" }
        ];

        const totalAxes = categories.length;
        const angleStep = (Math.PI * 2) / totalAxes;

        // Draw background web polygons
        for (let level = 1; level <= 4; level++) {
            const r = (radius / 4) * level;
            this.radarCtx.beginPath();
            this.radarCtx.strokeStyle = "rgba(255, 255, 255, 0.08)";
            this.radarCtx.lineWidth = 1;

            for (let i = 0; i < totalAxes; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);
                if (i === 0) this.radarCtx.moveTo(x, y);
                else this.radarCtx.lineTo(x, y);
            }
            this.radarCtx.closePath();
            this.radarCtx.stroke();
        }

        // Draw axis spokes & labels
        this.radarCtx.font = "600 12px Outfit, sans-serif";
        this.radarCtx.textAlign = "center";
        this.radarCtx.textBaseline = "middle";

        for (let i = 0; i < totalAxes; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);

            this.radarCtx.strokeStyle = "rgba(255, 255, 255, 0.15)";
            this.radarCtx.beginPath();
            this.radarCtx.moveTo(cx, cy);
            this.radarCtx.lineTo(x, y);
            this.radarCtx.stroke();

            // Label positioning
            const labelX = cx + (radius + 28) * Math.cos(angle);
            const labelY = cy + (radius + 20) * Math.sin(angle);

            this.radarCtx.fillStyle = categories[i].color;
            this.radarCtx.fillText(`${categories[i].label} (${categories[i].score})`, labelX, labelY);
        }

        // Draw dynamic data polygon
        this.radarCtx.beginPath();
        this.radarCtx.strokeStyle = "#00f2fe";
        this.radarCtx.fillStyle = "rgba(0, 242, 254, 0.25)";
        this.radarCtx.lineWidth = 3;

        for (let i = 0; i < totalAxes; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const r = (radius * (categories[i].score / 100));
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);

            if (i === 0) this.radarCtx.moveTo(x, y);
            else this.radarCtx.lineTo(x, y);
        }
        this.radarCtx.closePath();
        this.radarCtx.fill();
        this.radarCtx.stroke();
    }

    generateClinicalReport(state) {
        if (!this.reportContainer) return;

        const timestamp = new Date().toLocaleString();
        const overallScore = state.scores.overall || 85;

        let scoreBadgeClass = "green";
        let scoreTitle = "Optimal Health Telemetry";
        if (overallScore < 70) {
            scoreBadgeClass = "amber";
            scoreTitle = "Sub-Optimal / Clinical Triage Recommended";
        }
        if (overallScore < 60) {
            scoreBadgeClass = "red";
            scoreTitle = "Biometric Risk Alerts Flagged";
        }

        const html = `
            <div class="report-header-banner" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid rgba(0,242,254,0.3); padding-bottom: 15px; margin-bottom: 20px;">
                <div>
                    <h3 style="color: #00f2fe; margin-bottom: 4px;">OmniCheck AI — Diagnostic Summary</h3>
                    <p style="font-size: 12px; color: #94a3b8;">Timestamp: ${timestamp} | Client-Side Biometric Signal Processing</p>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 32px; font-weight: 800; color: #00f2fe;">${overallScore}<small style="font-size: 16px; color: #94a3b8;">/100</small></div>
                    <span style="font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 12px; background: rgba(0,242,254,0.15); color: #00f2fe;">${scoreTitle}</span>
                </div>
            </div>

            <div class="report-grid">
                <div class="report-section-box">
                    <h4><i class="fa-solid fa-heart-pulse"></i> Cardiovascular Telemetry</h4>
                    <table class="report-table">
                        <tr><th>Metric</th><th>Observed Value</th><th>Reference Range</th></tr>
                        <tr><td>Heart Rate (BPM)</td><td><strong>${state.cardio.bpm} BPM</strong></td><td>60 - 100 BPM</td></tr>
                        <tr><td>HRV (RMSSD)</td><td><strong>${state.cardio.hrv} ms</strong></td><td>40 - 100 ms</td></tr>
                        <tr><td>Est. Blood Pressure</td><td><strong>${state.cardio.bpSys}/${state.cardio.bpDia} mmHg</strong></td><td>&lt;120/80 mmHg</td></tr>
                        <tr><td>SpO2 Saturation</td><td><strong>${state.cardio.spo2}%</strong></td><td>95 - 100%</td></tr>
                    </table>
                </div>

                <div class="report-section-box">
                    <h4><i class="fa-solid fa-eye"></i> Ocular & Metabolic Scan</h4>
                    <table class="report-table">
                        <tr><th>Metric</th><th>Observed Value</th><th>Reference Range</th></tr>
                        <tr><td>Palpebral Hemoglobin</td><td><strong>${state.ocular.palenessStatus}</strong></td><td>13.5 - 17.5 g/dL</td></tr>
                        <tr><td>Sclera Bilirubin</td><td><strong>${state.ocular.bilirubinStatus}</strong></td><td>Clear Sclera</td></tr>
                        <tr><td>Facial Motor Symmetry</td><td><strong>${state.ocular.symmetry}%</strong></td><td>&gt;95% Symmetrical</td></tr>
                    </table>
                </div>

                <div class="report-section-box">
                    <h4><i class="fa-solid fa-lungs"></i> Respiratory & Vocal Acoustics</h4>
                    <table class="report-table">
                        <tr><th>Metric</th><th>Observed Value</th><th>Reference Range</th></tr>
                        <tr><td>Vocal Hydration</td><td><strong>${state.respiratory.hydration}%</strong></td><td>&gt;80% Hydration</td></tr>
                        <tr><td>Pitch Jitter (%)</td><td><strong>${state.respiratory.jitter}%</strong></td><td>&lt;1.04%</td></tr>
                        <tr><td>Amplitude Shimmer</td><td><strong>${state.respiratory.shimmer}%</strong></td><td>&lt;3.81%</td></tr>
                        <tr><td>Harmonics-to-Noise</td><td><strong>${state.respiratory.hnr} dB</strong></td><td>&gt;20 dB</td></tr>
                    </table>
                </div>

                <div class="report-section-box">
                    <h4><i class="fa-solid fa-brain"></i> Neuromotor Dexterity</h4>
                    <table class="report-table">
                        <tr><th>Metric</th><th>Observed Value</th><th>Reference Range</th></tr>
                        <tr><td>Tapping Speed (TPS)</td><td><strong>${state.motor.tps} TPS</strong></td><td>&gt;6.0 TPS</td></tr>
                        <tr><td>Frequency Decay</td><td><strong>${state.motor.decay}%</strong></td><td>&lt;10% Decay</td></tr>
                        <tr><td>Reaction Latency</td><td><strong>${state.motor.reactionMs} ms</strong></td><td>&lt;300 ms</td></tr>
                    </table>
                </div>
            </div>

            <div class="report-section-box" style="margin-top: 16px;">
                <h4><i class="fa-solid fa-user-doctor"></i> Actionable Clinical Triage Guidance</h4>
                <ul style="padding-left: 20px; font-size: 13px; color: #cbd5e1; display: flex; flex-direction: column; gap: 6px;">
                    ${state.guidance.map(g => `<li><strong>[${g.type.toUpperCase()}]</strong> ${g.text}</li>`).join('')}
                </ul>
            </div>
        `;

        this.reportContainer.innerHTML = html;
    }
}

window.ReportGenerator = ReportGenerator;
