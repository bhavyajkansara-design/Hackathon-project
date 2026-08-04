/* ==========================================================================
   OmniCheck AI — Interactive Motor Cadence & Dexterity Engine
   ========================================================================== */

class MotorScanner {
    constructor() {
        this.viewport = document.getElementById('tapTestArea');
        this.targetCircle = document.getElementById('tapTarget');
        this.canvas = document.getElementById('canvasMotorTrace');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

        this.isTesting = false;
        this.durationSec = 10;
        this.taps = [];
        this.startTime = 0;
        this.timerId = null;
        this.animFrameId = null;

        this.onProgress = null;
        this.onComplete = null;

        this.initCanvas();
        this.bindEvents();
        window.addEventListener('resize', () => this.initCanvas());
    }

    initCanvas() {
        if (!this.canvas) return;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width || 600;
        this.canvas.height = rect.height || 420;
    }

    bindEvents() {
        if (this.targetCircle) {
            this.targetCircle.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                if (this.isTesting) {
                    this.registerTap();
                }
            });
        }
    }

    startTest() {
        this.isTesting = true;
        this.taps = [];
        this.startTime = Date.now();

        let elapsed = 0;
        this.timerId = setInterval(() => {
            elapsed = (Date.now() - this.startTime) / 1000;
            if (this.onProgress) this.onProgress(elapsed);

            if (elapsed >= this.durationSec) {
                this.stopTest();
            }
        }, 100);

        this.animateTrace();
    }

    registerTap() {
        const now = Date.now();
        this.taps.push(now);

        // Haptic feedback if available
        if (navigator.vibrate) navigator.vibrate(15);

        // Move target randomly within viewport to test saccadic motor precision
        if (this.viewport && this.targetCircle) {
            const vpRect = this.viewport.getBoundingClientRect();
            const maxX = vpRect.width - 160;
            const maxY = vpRect.height - 160;

            const randomX = Math.max(20, Math.floor(Math.random() * maxX));
            const randomY = Math.max(20, Math.floor(Math.random() * maxY));

            this.targetCircle.style.position = 'absolute';
            this.targetCircle.style.left = `${randomX}px`;
            this.targetCircle.style.top = `${randomY}px`;
        }
    }

    startSimulation() {
        this.isTesting = true;
        this.taps = [];
        this.startTime = Date.now();

        // Simulate realistic tapping interval (~7.5 TPS with slight decay)
        let simInterval = 135; // ms
        const simStep = () => {
            if (!this.isTesting) return;

            this.registerTap();
            simInterval += Math.random() * 4; // slight fatigue decay

            const elapsed = (Date.now() - this.startTime) / 1000;
            if (this.onProgress) this.onProgress(elapsed);

            if (elapsed >= this.durationSec) {
                this.stopTest();
                return;
            }

            setTimeout(simStep, simInterval);
        };

        simStep();
        this.animateTrace();
    }

    animateTrace() {
        if (!this.ctx) return;
        const w = this.canvas.width;
        const h = this.canvas.height;

        const draw = () => {
            if (!this.isTesting && this.taps.length === 0) return;

            this.ctx.clearRect(0, 0, w, h);

            // Draw tap frequency trace line
            if (this.taps.length >= 2) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = "#f59e0b";
                this.ctx.lineWidth = 3;
                this.ctx.shadowColor = "rgba(245, 158, 11, 0.6)";
                this.ctx.shadowBlur = 10;

                const intervals = [];
                for (let i = 1; i < this.taps.length; i++) {
                    intervals.push(this.taps[i] - this.taps[i - 1]);
                }

                const stepX = w / Math.max(30, this.taps.length);
                for (let i = 0; i < intervals.length; i++) {
                    const x = i * stepX;
                    const normY = Math.min(1, intervals[i] / 400); // 400ms max
                    const y = h - (normY * (h * 0.7) + h * 0.15);

                    if (i === 0) this.ctx.moveTo(x, y);
                    else this.ctx.lineTo(x, y);
                }
                this.ctx.stroke();
                this.ctx.shadowBlur = 0;
            }

            if (this.isTesting) {
                this.animFrameId = requestAnimationFrame(draw);
            }
        };

        this.animFrameId = requestAnimationFrame(draw);
    }

    stopTest() {
        this.isTesting = false;
        if (this.timerId) clearInterval(this.timerId);
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

        // Reset target position to center
        if (this.targetCircle) {
            this.targetCircle.style.left = 'calc(50% - 70px)';
            this.targetCircle.style.top = 'calc(50% - 70px)';
        }

        const totalTaps = this.taps.length;
        const tps = Math.round((totalTaps / this.durationSec) * 10) / 10;

        // Calculate frequency decay (first 5 sec vs last 5 sec)
        const midTime = this.startTime + 5000;
        const firstHalf = this.taps.filter(t => t < midTime).length;
        const secondHalf = this.taps.filter(t => t >= midTime).length;

        let decay = 0;
        if (firstHalf > 0) {
            decay = Math.max(0, Math.round(((firstHalf - secondHalf) / firstHalf) * 100));
        }

        let dexterityScore = Math.min(100, Math.max(30, Math.round(tps * 11 - decay * 0.8)));

        if (this.onComplete) {
            this.onComplete({
                tapCount: totalTaps,
                tps: tps,
                decay: decay,
                dexterity: `${dexterityScore}/100`,
                reactionMs: Math.round(1000 / (tps || 1))
            });
        }
    }
}

window.MotorScanner = MotorScanner;
