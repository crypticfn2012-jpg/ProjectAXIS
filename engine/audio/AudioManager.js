import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";
export class AudioManager {

    constructor(camera) {

        this.listener =
            new THREE.AudioListener();

        camera.add(
            this.listener
        );

        this.sounds =
            new Map();

        this.masterVolume = 1;
        this.muted = false;
        this.music = null;
    }

    async load(name, url) {

        const audio =
            new Audio(url);

        audio.preload = "auto";

        this.sounds.set(
            name,
            audio
        );

        return audio;
    }

    play(name) {

        const sound =
            this.sounds.get(name);

        if (!sound) return;

        sound.currentTime = 0;

        sound.volume = this.muted ? 0 : Math.min(1, sound.dataset.ronVolume * this.masterVolume || this.masterVolume);
        return sound.play().catch(() => {});
    }

    stop(name) {

        const sound =
            this.sounds.get(name);

        if (!sound) return;

        sound.pause();

        sound.currentTime = 0;
    }

    setVolume(name, volume) {

        const sound =
            this.sounds.get(name);

        if (!sound) return;

        sound.dataset.ronVolume = Math.max(0, Math.min(1, volume));
        sound.volume = this.muted ? 0 : sound.dataset.ronVolume * this.masterVolume;
    }

    playMusic(name, { loop = true } = {}) {
        if (this.music && this.music !== name) this.stop(this.music);
        const sound = this.sounds.get(name);
        if (!sound) return;
        sound.loop = loop;
        this.music = name;
        return this.play(name);
    }

    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        for (const [name] of this.sounds) this.setVolume(name, this.sounds.get(name).dataset.ronVolume ?? 1);
    }

    setMuted(muted = true) { this.muted = muted; this.setMasterVolume(this.masterVolume); }
    toggleMute() { this.setMuted(!this.muted); return this.muted; }
}
