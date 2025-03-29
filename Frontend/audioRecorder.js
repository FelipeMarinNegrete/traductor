class AudioRecorder {
    constructor(silenceThreshold = 10, silenceTimeout = 2000) {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.audioElement = null;

        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.scriptProcessor = null;

        this.silenceThreshold = silenceThreshold;
        this.silenceTimeout = silenceTimeout;
        this.silenceTimer = null;
    }

    async startRecording() {
        alert("llamamos a start")
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Tu navegador no soporta la grabación de audio.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.start();
            console.log("Grabación iniciada...");

            // Configurar la detección de silencio
            this.setupSilenceDetection(stream);
        } catch (error) {
            console.error("Error al acceder al micrófono:", error);
        }
    }

    stopRecording() {
        if (this.mediaRecorder) {
            this.mediaRecorder.stop();
            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: "audio/wav; codecs=opus" });
                const audioURL = URL.createObjectURL(audioBlob);

                // Reemplazar el audio anterior o crear uno nuevo
                if (!this.audioElement) {
                    this.audioElement = document.createElement("audio");
                    this.audioElement.controls = true;
                    document.body.appendChild(this.audioElement);
                }

                this.audioElement.src = audioURL;
                this.audioChunks = []; // Limpiar para la próxima grabación
            };

            // Detener el análisis de audio
            if (this.audioContext) {
                this.audioContext.close();
            }
            clearTimeout(this.silenceTimer);
            console.log("Grabación detenida.");
        } else {
            alert("No se está grabando audio actualmente.");
        }
    }

    setupSilenceDetection(stream) {
        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.microphone = this.audioContext.createMediaStreamSource(stream);
        this.scriptProcessor = this.audioContext.createScriptProcessor(256, 1, 1);

        this.analyser.smoothingTimeConstant = 0.95;
        this.analyser.fftSize = 2048;

        this.microphone.connect(this.analyser);
        this.analyser.connect(this.scriptProcessor);
        this.scriptProcessor.connect(this.audioContext.destination);

        this.scriptProcessor.onaudioprocess = () => {
            let array = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(array);

            let values = array.reduce((a, b) => a + b, 0);
            let average = values / array.length;

            console.log("Volumen promedio:", average);

            if (average < this.silenceThreshold) {
                if (!this.silenceTimer) {
                    this.silenceTimer = setTimeout(() => this.stopRecording(), this.silenceTimeout);
                }
            } else {
                clearTimeout(this.silenceTimer);
                this.silenceTimer = null;
            }
        };
    }
}

// Exportar la clase para su uso en otros archivos
export default AudioRecorder;