import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";

export class Material {

    static basic(color = 0xffffff) {

        return new THREE.MeshStandardMaterial({
            color
        });
    }

    static emissive(
        color = 0xffffff,
        intensity = 1
    ) {

        return new THREE.MeshStandardMaterial({

            color,

            emissive: color,

            emissiveIntensity:
                intensity
        });
    }

    static glass(color = 0xffffff) {

        return new THREE.MeshPhysicalMaterial({

            color,

            transparent: true,

            opacity: 0.35,

            roughness: 0.1,

            metalness: 0
        });
    }

    static metal(color = 0xffffff) {

        return new THREE.MeshStandardMaterial({

            color,

            metalness: 0.9,

            roughness: 0.2
        });
    }
}