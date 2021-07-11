import * as basic from "./basic.js";

export var synth;
export var currentBpm;
export var ttsUtterance = "speechSynthesis" in window ? new SpeechSynthesisUtterance() : null;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function beatsToMilliseconds(bpm = currentBpm) {
    return (60 * 1000) / bpm;
}

export function setEnvelope(attack, decay, sustain, release) {
    synth.set({
        envelope: {
            attack: Math.max(attack, 0) / 1000,
            decay: Math.max(decay, 0) / 1000,
            sustain: clamp(sustain, 0, 1),
            release: Math.max(release, 0) / 1000
        }
    });
}

export function setVolume(amount) {
    synth.volume.value = 20 * Math.log10(clamp(amount, 0, 1));
}

export function setVoice(pitch, rate) {
    if (ttsUtterance == null) {
        return;
    }

    ttsUtterance.pitch = pitch;
    ttsUtterance.rate = rate;
}

export function setBpm(bpm) {
    currentBpm = bpm;
}

export function play(note, beats = 1) {
    var frequency = new Tone.Frequency(note).toFrequency();

    if (Number.isNaN(frequency)) {
        throw new basic.RuntimeError("Invalid note");
    }

    synth.triggerAttackRelease(frequency, (beatsToMilliseconds() * beats) / 1000);
}

export function quiet() {
    synth.releaseAll();

    speechSynthesis.cancel();
}

export function speak(message) {
    if (ttsUtterance == null) {
        return;
    }

    ttsUtterance.text = message;

    speechSynthesis.speak(ttsUtterance);
}

export function init() {
    setEnvelope(100, 200, 0.5, 800);
    setVolume(1);
    setBpm(120);
}

window.addEventListener("load", function() {
    synth = new Tone.PolySynth().toDestination();

    init();
});