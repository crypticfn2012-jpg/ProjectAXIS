import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";

export class Collision {

    constructor(a, b) {

        this.a = a;
        this.b = b;

        this.normal = new THREE.Vector3();

        this.depth = 0;

        this.point = new THREE.Vector3();
    }
}