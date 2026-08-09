import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";
import { Component } from "../core/Component.js";

export class BoxCollider extends Component {

    constructor(entity, size = new THREE.Vector3(1,1,1)) {

        super(entity);

        this.size =
            size.clone();

        this.offset =
            new THREE.Vector3();

        this.isTrigger = false;
        this.isStatic = true;
    }

    get min() {

        return new THREE.Vector3(
            this.entity.position.x + this.offset.x -
                this.size.x / 2,

            this.entity.position.y + this.offset.y -
                this.size.y / 2,

            this.entity.position.z + this.offset.z -
                this.size.z / 2
        );
    }

    get max() {

        return new THREE.Vector3(
            this.entity.position.x + this.offset.x +
                this.size.x / 2,

            this.entity.position.y + this.offset.y +
                this.size.y / 2,

            this.entity.position.z + this.offset.z +
                this.size.z / 2
        );
    }
}
