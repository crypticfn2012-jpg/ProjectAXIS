import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";

export class Entity {

    constructor(name = "Entity") {

        this.name = name;

        this.id =
            crypto.randomUUID();

        this.sceneObject =
            new THREE.Object3D();

        this.components = [];

        this.children = [];

        this.parent = null;

        this.active = true;

        this.tags = [];
    }

    addComponent(component) {

        component.entity = this;

        this.components.push(component);

        if (component.start) {
            component.start();
        }

        return component;
    }

    getComponent(type) {

        return this.components.find(
            c => c instanceof type
        );
    }

    removeComponent(type) {

        const component =
            this.getComponent(type);

        if (!component) return;

        component.destroy?.();

        this.components =
            this.components.filter(
                c => c !== component
            );
    }

    addChild(child) {

        if (child.parent) {
            child.parent.removeChild(child);
        }

        child.parent = this;

        this.children.push(child);

        this.sceneObject.add(
            child.sceneObject
        );

        return child;
    }

    removeChild(child) {

        this.children =
            this.children.filter(
                c => c !== child
            );

        this.sceneObject.remove(
            child.sceneObject
        );

        child.parent = null;
    }

    update(delta) {

        if (!this.active) return;

        for (const component of this.components) {

            if (
                component.enabled &&
                component.update
            ) {
                component.update(delta);
            }
        }

        for (const child of this.children) {
            child.update(delta);
        }
    }

    fixedUpdate(delta) {

        if (!this.active) return;

        for (const component of this.components) {

            if (
                component.enabled &&
                component.fixedUpdate
            ) {
                component.fixedUpdate(delta);
            }
        }

        for (const child of this.children) {
            child.fixedUpdate(delta);
        }
    }

    destroy() {

        for (const component of this.components) {
            component.destroy?.();
        }

        for (const child of this.children) {
            child.destroy();
        }

        this.sceneObject.removeFromParent();

        this.components = [];

        this.children = [];

        this.active = false;
    }

    setPosition(x, y, z) {

        this.sceneObject.position.set(
            x, y, z
        );

        return this;
    }

    setRotation(x, y, z) {

        this.sceneObject.rotation.set(
            x, y, z
        );

        return this;
    }

    setScale(x, y, z = x) {

        this.sceneObject.scale.set(
            x, y, z
        );

        return this;
    }

    get position() {
        return this.sceneObject.position;
    }

    get rotation() {
        return this.sceneObject.rotation;
    }

    get scale() {
        return this.sceneObject.scale;
    }
}
