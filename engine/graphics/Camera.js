import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";

export class Camera {

    constructor() {

        this.camera =
            new THREE.PerspectiveCamera(
                75,
                window.innerWidth /
                window.innerHeight,
                0.05,
                2000
            );

        this.camera.position.set(
            0,
            2,
            6
        );

        this.sensitivity = 0.002;

        this.pitch = 0;

        this.yaw = 0;

        this.target = null;
    }

    resize() {

        this.camera.aspect =
            window.innerWidth /
            window.innerHeight;

        this.camera.updateProjectionMatrix();
    }

    lookAt(target) {

        this.camera.lookAt(target);
    }

    follow(entity) {

        this.target = entity;
    }

    update() {

        if (!this.target) return;

        const pos =
            this.target.position;

        this.camera.position.copy(pos);

        this.camera.position.y += 1.6;

        this.camera.rotation.order =
            "YXZ";

        this.camera.rotation.y =
            this.yaw;

        this.camera.rotation.x =
            this.pitch;
    }
}