import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";

export class ParticleSystem {

    constructor(scene, options = {}) {

        this.scene = scene;

        this.count =
            options.count || 500;

        this.particles = [];

        const geometry =
            new THREE.BufferGeometry();

        const positions =
            new Float32Array(
                this.count * 3
            );

        for (
            let i = 0;
            i < this.count;
            i++
        ) {

            positions[i * 3] =
                (Math.random() - 0.5) * 10;

            positions[i * 3 + 1] =
                Math.random() * 10;

            positions[i * 3 + 2] =
                (Math.random() - 0.5) * 10;
        }

        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(
                positions,
                3
            )
        );

        const material =
            new THREE.PointsMaterial({
                color:
                    options.color ||
                    0xffffff,

                size:
                    options.size ||
                    0.05
            });

        this.points =
            new THREE.Points(
                geometry,
                material
            );

        scene.add(
            this.points
        );
    }

    update() {

        this.points.rotation.y +=
            0.0005;
    }
}