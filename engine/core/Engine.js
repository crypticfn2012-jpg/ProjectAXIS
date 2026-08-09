import { Scene } from "./Scene.js";
import { Entity } from "./Entity.js";
import { Time } from "./Time.js";
import { Renderer } from "../graphics/Renderer.js";
import { Camera } from "../graphics/Camera.js";
import { Input } from "../input/input.js";
import { PhysicsWorld } from "../physics/PhysicsWorld.js";
import { BoxCollider } from "../physics/Collider.js";
import { Rigidbody } from "../physics/Rigidbody.js";
import { AssetManager } from "../assets/AssetManager.js";
import { UI } from "../ui/UI.js";
import { Raycast } from "../physics/Raycast.js";
import { Debug } from "../utils/Debug.js";
import { DebugOverlay } from "../utils/DebugOverlay.js";
import { AudioManager } from "../audio/AudioManager.js";

export class RonEngine {
    constructor(options = {}) {
        this.options = options;
        this.renderer = new Renderer(options);
        this.scene = new Scene();
        this.camera = new Camera();
        this.input = new Input();
        this.physics = new PhysicsWorld();
        this.physics.setColliderClass(BoxCollider);
        this.assets = new AssetManager();
        this.audio = new AudioManager(this.camera.camera);
        this.ui = new UI();
        this.raycast = new Raycast();
        this.debug = new DebugOverlay(this);
        this.scenes = new Map();
        this.running = false;
        this.paused = false;
        this.started = false;
        this.updateCallbacks = [];
        this.fixedCallbacks = [];
        this.fixedAccumulator = 0;
        this.fixedStep = options.fixedStep ?? 1 / 60;
        this.maxFixedSteps = options.maxFixedSteps ?? 5;
        this.renderer.setQuality(options.quality ?? "high");
        window.addEventListener("resize", () => this.camera.resize());
        Debug.log("Ron Engine initialized");
    }

    createEntity(name = "Entity") { return this.scene.add(new Entity(name)); }
    createScene(name = "Scene") { const scene = new Scene(); scene.name = name; this.scenes.set(name, scene); return scene; }
    registerScene(name, scene) { if (!(scene instanceof Scene)) throw new TypeError("registerScene expects a Scene instance"); scene.name = name; this.scenes.set(name, scene); return scene; }
    loadScene(sceneOrName) {
        const scene = typeof sceneOrName === "string" ? this.scenes.get(sceneOrName) : sceneOrName;
        if (!(scene instanceof Scene)) throw new Error(`Unknown Ron Engine scene: ${sceneOrName}`);
        if (scene === this.scene) return scene;
        this.scene = scene; this.camera.follow(null); return scene;
    }
    setQuality(quality) { this.renderer.setQuality(quality); }
    onUpdate(callback) { this.updateCallbacks.push(callback); return () => this.offUpdate(callback); }
    offUpdate(callback) { this.updateCallbacks = this.updateCallbacks.filter(item => item !== callback); }
    onFixedUpdate(callback) { this.fixedCallbacks.push(callback); return () => { this.fixedCallbacks = this.fixedCallbacks.filter(item => item !== callback); }; }

    start() {
        if (this.running) return;
        this.running = true; this.paused = false; Time.reset();
        if (!this.started) { this.started = true; this.startGame(); }
        requestAnimationFrame(now => this.loop(now));
    }
    startGame() {}
    loop(now) {
        if (!this.running) return;
        const delta = Time.update(now);
        if (!this.paused) this.update(delta);
        this.renderer.render(this.scene.threeScene, this.camera.camera);
        this.debug.update();
        this.input.update();
        requestAnimationFrame(next => this.loop(next));
    }
    update(delta) {
        this.scene.update(delta); this.camera.update(delta);
        for (const callback of this.updateCallbacks) callback(delta);
        this.fixedAccumulator += delta;
        let steps = 0;
        while (this.fixedAccumulator >= this.fixedStep && steps++ < this.maxFixedSteps) {
            this.fixedUpdate(this.fixedStep); this.fixedAccumulator -= this.fixedStep;
        }
        if (steps === this.maxFixedSteps) this.fixedAccumulator = 0;
    }
    fixedUpdate(delta) {
        this.scene.fixedUpdate(delta);
        this.physics.bodies = this.findComponents(Rigidbody);
        this.physics.colliders = this.findComponents(BoxCollider);
        this.physics.step();
        for (const callback of this.fixedCallbacks) callback(delta);
    }
    findComponents(type) {
        const found = [];
        const visit = entity => { const component = entity.getComponent(type); if (component) found.push(component); entity.children.forEach(visit); };
        this.scene.entities.forEach(visit); return found;
    }
    pause() { this.paused = true; }
    resume() { if (!this.running) this.start(); else { this.paused = false; Time.reset(); } }
    stop() { this.running = false; }
    destroy() { this.stop(); this.scene.clear(); this.renderer.dispose(); this.ui.container.remove(); this.debug.destroy(); }
}
