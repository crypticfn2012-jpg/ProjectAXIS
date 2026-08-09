import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";
import { Component } from "../core/Component.js";

export class CharacterController extends Component {

    constructor(
        entity,
        input,
        camera,
        physics = null
    ) {

        super(entity);

        this.input = input;

        this.camera = camera;
        this.physics = physics;

        this.speed = 6;

        this.sprintSpeed = 10;

        this.jumpForce = 8;

        this.acceleration = 15;

        this.velocity =
            new THREE.Vector3();

        this.height = 1.8;

        this.groundHeight = this.height / 2;

        this.mouseSensitivity = 0.002;
    }

    fixedUpdate(dt) {

        const keyboard =
            this.input.keyboard;

        const mouse =
            this.input.mouse;

        if (
            document.pointerLockElement
        ) {

            this.camera.yaw -=
                mouse.deltaX *
                this.mouseSensitivity;

            this.camera.pitch -=
                mouse.deltaY *
                this.mouseSensitivity;

            this.camera.pitch =
                Math.max(
                    -Math.PI / 2 + 0.05,
                    Math.min(
                        Math.PI / 2 - 0.05,
                        this.camera.pitch
                    )
                );
        }

        const forward =
            new THREE.Vector3(
                0,
                0,
                -1
            );

        const right =
            new THREE.Vector3(
                1,
                0,
                0
            );

        forward.applyAxisAngle(
            new THREE.Vector3(0,1,0),
            this.camera.yaw
        );

        right.applyAxisAngle(
            new THREE.Vector3(0,1,0),
            this.camera.yaw
        );

        const movement =
            new THREE.Vector3();

        if (
            keyboard.isDown("KeyW")
        ) {
            movement.add(forward);
        }

        if (
            keyboard.isDown("KeyS")
        ) {
            movement.sub(forward);
        }

        if (
            keyboard.isDown("KeyD")
        ) {
            movement.add(right);
        }

        if (
            keyboard.isDown("KeyA")
        ) {
            movement.sub(right);
        }

        if (movement.lengthSq() > 0) {

            movement.normalize();

            const sprint =
                keyboard.isDown(
                    "ShiftLeft"
                );

            const speed =
                sprint
                    ? this.sprintSpeed
                    : this.speed;

            this.velocity.x =
                THREE.MathUtils.damp(
                    this.velocity.x,
                    movement.x * speed,
                    this.acceleration,
                    dt
                );

            this.velocity.z =
                THREE.MathUtils.damp(
                    this.velocity.z,
                    movement.z * speed,
                    this.acceleration,
                    dt
                );

        } else {

            this.velocity.x =
                THREE.MathUtils.damp(
                    this.velocity.x,
                    0,
                    this.acceleration,
                    dt
                );

            this.velocity.z =
                THREE.MathUtils.damp(
                    this.velocity.z,
                    0,
                    this.acceleration,
                    dt
                );
        }

        this.entity.position.x +=
            this.velocity.x * dt;

        this.entity.position.z +=
            this.velocity.z * dt;

        if (
            keyboard.isPressed("Space") &&
            this.isGrounded()
        ) {

            this.velocity.y =
                this.jumpForce;
        }

        this.velocity.y +=
            -20 * dt;

        this.entity.position.y +=
            this.velocity.y * dt;

        if (this.entity.position.y < this.groundHeight) {
            this.entity.position.y = this.groundHeight;
            this.velocity.y = 0;
        }

        const collider = this.entity.getComponent(this.physics?.boxColliderClass);
        if (collider && this.physics) {
            const body = { entity: this.entity, velocity: this.velocity, grounded: false };
            for (const other of this.physics.colliders) {
                if (other !== collider && other.isStatic) this.physics.resolveBox(body, collider, other);
            }
        }

    }

    isGrounded() {

        return (
            this.entity.position.y <=
            this.height / 2 + 0.01
        );
    }
}
