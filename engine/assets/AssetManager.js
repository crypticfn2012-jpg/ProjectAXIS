import { GLTFLoader } from
"https://unpkg.com/three@0.158.0/examples/jsm/loaders/GLTFLoader.js";

import * as THREE from
"https://unpkg.com/three@0.158.0/build/three.module.js";

export class AssetManager {

    constructor() {

        this.gltf =
            new GLTFLoader();

        this.textureLoader =
            new THREE.TextureLoader();

        this.cache =
            new Map();

        this.loading = new Set();
        this.loaded = 0;
        this.failed = 0;
    }

    async loadModel(url) {

        if (this.cache.has(url)) {

            return this.cache.get(url)
                .clone(true);
        }

        this.loading.add(url);
        let gltf;
        try { gltf = await this.gltf.loadAsync(url); this.loaded++; }
        catch (error) { this.failed++; throw new Error(`Could not load model ${url}: ${error.message}`); }
        finally { this.loading.delete(url); }

        this.cache.set(
            url,
            gltf.scene
        );

        return gltf.scene.clone(true);
    }

    async loadTexture(url) {

        if (this.cache.has(url)) {

            return this.cache.get(url);
        }

        this.loading.add(url);
        let texture;
        try { texture = await this.textureLoader.loadAsync(url); this.loaded++; }
        catch (error) { this.failed++; throw new Error(`Could not load texture ${url}: ${error.message}`); }
        finally { this.loading.delete(url); }

        this.cache.set(
            url,
            texture
        );

        return texture;
    }

    async loadJSON(url) {
        if (this.cache.has(url)) return this.cache.get(url);
        this.loading.add(url);
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            const data = await response.json(); this.cache.set(url, data); this.loaded++; return data;
        } catch (error) { this.failed++; throw new Error(`Could not load JSON ${url}: ${error.message}`); }
        finally { this.loading.delete(url); }
    }

    get progress() { return { loading: this.loading.size, loaded: this.loaded, failed: this.failed }; }
}
