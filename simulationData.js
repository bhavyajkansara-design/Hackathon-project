/* ==========================================================================
   OmniCheck AI — Synthetic Clinical Profiles for Hackathon Judge Demo
   ========================================================================== */

const SimulationData = {
    athletic: {
        id: "athletic",
        name: "Optimal Athletic Profile",
        description: "High parasympathetic tone, optimal hydration, balanced motor control",
        scores: {
            cardio: 98,
            ocular: 96,
            respiratory: 95,
            motor: 94,
            overall: 96
        },
        cardio: {
            bpm: 58,
            hrv: 78,
            bpSys: 116,
            bpDia: 74,
            spo2: 99,
            stress: "Optimal (Resting)"
        },
        ocular: {
            hemoglobin: 15.1,
            palenessStatus: "Normal (15.1 g/dL)",
            bilirubinStatus: "Normal (Clear Sclera)",
            symmetry: 99.2,
            respRate: 14
        },
        respiratory: {
            hydration: 94,
            jitter: 0.42,
            shimmer: 1.1,
            hnr: 24.5,
            respRate: 14
        },
        motor: {
            tapCount: 82,
            tps: 8.2,
            decay: 2.1,
            dexterity: "Superior (94/100)",
            reactionMs: 210
        },
        guidance: [
            { text: "Cardiovascular autonomic resilience is optimal (HRV 78ms).", type: "green" },
            { text: "Ocular sclera & palpebral hemoglobin within ideal clinical ranges.", type: "green" },
            { text: "Vocal fold mucosal hydration is excellent (Harmonics 24.5 dB).", type: "green" }
        ]
    },

    dehydrated_stress: {
        id: "dehydrated_stress",
        name: "Dehydration & High Autonomic Stress",
        description: "Sympathetic elevation, reduced vocal fold mucosal fluid, high pitch jitter",
        scores: {
            cardio: 62,
            ocular: 80,
            respiratory: 54,
            motor: 70,
            overall: 66
        },
        cardio: {
            bpm: 92,
            hrv: 26,
            bpSys: 138,
            bpDia: 88,
            spo2: 96,
            stress: "Elevated Sympathetic"
        },
        ocular: {
            hemoglobin: 13.8,
            palenessStatus: "Normal (13.8 g/dL)",
            bilirubinStatus: "Normal",
            symmetry: 97.5,
            respRate: 20
        },
        respiratory: {
            hydration: 42,
            jitter: 4.45,
            shimmer: 6.8,
            hnr: 12.1,
            respRate: 20
        },
        motor: {
            tapCount: 54,
            tps: 5.4,
            decay: 18.5,
            dexterity: "Moderate Fatigue",
            reactionMs: 340
        },
        guidance: [
            { text: "Vocal fold acoustic jitter (4.45%) indicates acute intracellular dehydration.", type: "amber" },
            { text: "Low HRV (26ms) and elevated heart rate indicate high autonomic fatigue.", type: "amber" },
            { text: "Recommended protocol: Rehydrate with 1.2L fluid + electrolytes.", type: "amber" }
        ]
    },

    anemia_fatigue: {
        id: "anemia_fatigue",
        name: "Anemia & Low Hemoglobin Risk",
        description: "Reduced conjunctival redness index, pale facial tissue, lower oxygen transport",
        scores: {
            cardio: 68,
            ocular: 48,
            respiratory: 72,
            motor: 56,
            overall: 61
        },
        cardio: {
            bpm: 84,
            hrv: 38,
            bpSys: 108,
            bpDia: 68,
            spo2: 94,
            stress: "Moderate Stress"
        },
        ocular: {
            hemoglobin: 9.4,
            palenessStatus: "Pallor Alert (9.4 g/dL)",
            bilirubinStatus: "Borderline Bilirubin",
            symmetry: 96.1,
            respRate: 18
        },
        respiratory: {
            hydration: 76,
            jitter: 1.25,
            shimmer: 2.8,
            hnr: 18.4,
            respRate: 18
        },
        motor: {
            tapCount: 48,
            tps: 4.8,
            decay: 14.2,
            dexterity: "Sub-optimal Speed",
            reactionMs: 380
        },
        guidance: [
            { text: "Eyelid palpebral redness index indicates potential Mild Anemia (9.4 g/dL).", type: "red" },
            { text: "SpO2 (94%) reflects lower oxygen transport capacity.", type: "amber" },
            { text: "Clinical consultation recommended for complete blood count (CBC).", type: "red" }
        ]
    },

    respiratory_wheeze: {
        id: "respiratory_wheeze",
        name: "Bronchial Wheeze / Respiratory Strain",
        description: "Acoustic resonance frequency shift, elevated breathing rate",
        scores: {
            cardio: 74,
            ocular: 88,
            respiratory: 46,
            motor: 78,
            overall: 71
        },
        cardio: {
            bpm: 88,
            hrv: 44,
            bpSys: 126,
            bpDia: 80,
            spo2: 95,
            stress: "Mild Elevation"
        },
        ocular: {
            hemoglobin: 14.2,
            palenessStatus: "Normal (14.2 g/dL)",
            bilirubinStatus: "Normal",
            symmetry: 98.0,
            respRate: 24
        },
        respiratory: {
            hydration: 68,
            jitter: 2.85,
            shimmer: 5.1,
            hnr: 14.2,
            respRate: 24
        },
        motor: {
            tapCount: 68,
            tps: 6.8,
            decay: 6.5,
            dexterity: "Normal (78/100)",
            reactionMs: 260
        },
        guidance: [
            { text: "Respiratory acoustic spectrum indicates high frequency bronchial resonance.", type: "amber" },
            { text: "Elevated resting breathing rate (24 BPM).", type: "amber" },
            { text: "Avoid respiratory allergens and monitor peak expiratory flow.", type: "amber" }
        ]
    }
};

window.SimulationData = SimulationData;
