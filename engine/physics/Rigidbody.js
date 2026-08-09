import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";
import { Component } from "../core/Component.js";

export class Rigidbody extends Component {

    constructor(entity) {

        super(entity);

        this.velocity =
            new THREE.Vector3();

        this.acceleration =
            new THREE.Vector3();

        this.mass = 1;

        this.useGravity = true;

        this.gravity = -20;

        this.drag = 0;

        this.grounded = false;
    }

    addForce(force) {

        this.acceleration.add(
            force.clone().divideScalar(
                this.mass
            )
        );
    }

    fixedUpdate(dt) {

        if (this.useGravity) {

            this.velocity.y +=
                this.gravity * dt;
        }

        this.velocity.addScaledVector(
            this.acceleration,
            dt
        );

        if (this.drag > 0) {

            this.velocity.multiplyScalar(
                Math.max(
                    0,
                    1 - this.drag * dt
                )
            );
        }

        this.entity.position.addScaledVector(
            this.velocity,
            dt
        );

        this.acceleration.set(
            0,
            0,
            0
        );
    }
}
