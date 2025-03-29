import AudioRecorder from "./audioRecorder.js";

document.addEventListener("DOMContentLoaded", () => {
    const recorder = new AudioRecorder(); // Instanciamos el grabador

    document.getElementById("startRecording").addEventListener("click", () => {
        recorder.startRecording();
    });

    document.getElementById("stopRecording").addEventListener("click", () => {
        recorder.stopRecording();
    });
});