import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";

export class Raycast {

    constructor() {

        this.raycaster =
            new THREE.Raycaster();
    }

    cast(
        origin,
        direction,
        objects,
        distance = Infinity
    ) {

        this.raycaster.set(
            origin,
            direction.normalize()
        );

        this.raycaster.far =
            distance;

        return this.raycaster.intersectObjects(
            objects,
            true
        );
    }

    fromCamera(
        camera,
        objects,
        distance = Infinity
    ) {

        this.raycaster.setFromCamera(
            new THREE.Vector2(0,0),
            camera
        );

        this.raycaster.far =
            distance;

        return this.raycaster.intersectObjects(
            objects,
            true
        );
    }
}