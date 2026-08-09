import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";

export class Renderer {

    constructor(options = {}) {

        this.renderer =
            new THREE.WebGLRenderer({
                canvas: options.canvas,
                antialias: true,
                powerPreference: "high-performance"
            });

        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                options.maxPixelRatio || 2
            )
        );

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        this.renderer.shadowMap.enabled = true;

        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;

        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace;

        this.renderer.toneMapping =
            THREE.ACESFilmicToneMapping;

        this.renderer.toneMappingExposure = 1;

        if (!options.canvas) document.body.appendChild(this.renderer.domElement);

        window.addEventListener(
            "resize",
            () => this.resize()
        );
    }

    resize() {

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }

    render(scene, camera) {

        this.renderer.render(
            scene,
            camera
        );
    }

    setQuality(quality = "high") {
        const settings = { low: [1, false], medium: [1.25, true], high: [2, true], ultra: [3, true] };
        const [ratio, shadows] = settings[quality.toLowerCase()] ?? settings.high;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, ratio));
        this.renderer.shadowMap.enabled = shadows;
        this.resize();
    }

    dispose() {
        this.renderer.dispose();
        this.renderer.domElement.remove();
    }
}
