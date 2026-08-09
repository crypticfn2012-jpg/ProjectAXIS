import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";

export class PhysicsWorld {

    constructor() {

        this.bodies = [];

        this.colliders = [];

        this.gravity =
            new THREE.Vector3(
                0,
                -20,
                0
            );
    }

    addRigidbody(body) {

        if (!this.bodies.includes(body)) {
            this.bodies.push(body);
        }
    }

    addCollider(collider) {

        if (!this.colliders.includes(collider)) {
            this.colliders.push(collider);
        }
    }

    step() {
        for (const body of this.bodies) {
            const collider = body.entity.getComponent(this.boxColliderClass);
            if (!collider) continue;
            body.grounded = false;
            for (const other of this.colliders) {
                if (other === collider || other.entity === body.entity || !other.isStatic) continue;
                this.resolveBox(body, collider, other);
            }
        }
    }

    resolveBox(body, collider, other) {
        const aMin = collider.min, aMax = collider.max, bMin = other.min, bMax = other.max;
        const overlapX = Math.min(aMax.x, bMax.x) - Math.max(aMin.x, bMin.x);
        const overlapY = Math.min(aMax.y, bMax.y) - Math.max(aMin.y, bMin.y);
        const overlapZ = Math.min(aMax.z, bMax.z) - Math.max(aMin.z, bMin.z);
        if (overlapX <= 0 || overlapY <= 0 || overlapZ <= 0) return;
        const axis = overlapX < overlapY && overlapX < overlapZ ? "x" : overlapY < overlapZ ? "y" : "z";
        const direction = body.entity.position[axis] < other.entity.position[axis] ? -1 : 1;
        body.entity.position[axis] += direction * ({ x: overlapX, y: overlapY, z: overlapZ })[axis];
        body.velocity[axis] = 0;
        if (axis === "y" && direction > 0) body.grounded = true;
    }

    resolveGround(body, collider) {

        const bottom =
            body.entity.position.y -
            collider.size.y / 2;

        const floor = 0;

        if (bottom < floor) {

            body.entity.position.y =
                floor +
                collider.size.y / 2;

            if (body.velocity.y < 0) {
                body.velocity.y = 0;
            }

            body.grounded = true;
        } else {

            body.grounded = false;
        }
    }

    setColliderClass(cls) {

        this.boxColliderClass = cls;
    }
}
