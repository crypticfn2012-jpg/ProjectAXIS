import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";

export class Scene {

    constructor() {

        this.threeScene =
            new THREE.Scene();

        this.entities = [];

        this.entityMap =
            new Map();
    }

    add(entity) {

        this.entities.push(entity);

        this.entityMap.set(
            entity.id,
            entity
        );

        this.threeScene.add(
            entity.sceneObject
        );

        return entity;
    }

    remove(entity) {

        entity.destroy();

        this.entities =
            this.entities.filter(
                e => e !== entity
            );

        this.entityMap.delete(
            entity.id
        );
    }

    find(name) {

        return this.entities.find(
            e => e.name === name
        );
    }

    findById(id) {

        return this.entityMap.get(id);
    }

    update(delta) {

        for (const entity of this.entities) {
            entity.update(delta);
        }
    }

    fixedUpdate(delta) {

        for (const entity of this.entities) {
            entity.fixedUpdate(delta);
        }
    }

    clear() {

        for (const entity of this.entities) {
            entity.destroy();
        }

        this.entities = [];

        this.entityMap.clear();
    }
}
