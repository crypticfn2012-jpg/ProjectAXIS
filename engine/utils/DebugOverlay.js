import { Time } from "../core/Time.js";

export class DebugOverlay {
    constructor(engine) {
        this.engine = engine;
        this.visible = false;
        this.element = document.createElement("pre");
        this.element.id = "ron-engine-debug";
        Object.assign(this.element.style, {
            position: "fixed", top: "12px", right: "12px", margin: 0,
            padding: "12px 14px", color: "#bfffe2", background: "rgba(4, 12, 18, .86)",
            border: "1px solid rgba(105,255,196,.45)", borderRadius: "8px", zIndex: 1000,
            font: "12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace", pointerEvents: "none",
            display: "none"
        });
        document.body.appendChild(this.element);
        window.addEventListener("keydown", event => { if (event.code === "F3") { event.preventDefault(); this.toggle(); } });
    }

    toggle() { this.visible = !this.visible; this.element.style.display = this.visible ? "block" : "none"; }
    update() {
        if (!this.visible) return;
        const info = this.engine.renderer.renderer.info;
        const player = this.engine.scene.find("Player");
        const position = player?.position;
        this.element.textContent = [
            "RON ENGINE  •  DEBUG (F3)",
            `FPS       ${Time.fps.toFixed(0)}  |  ${(Time.delta * 1000).toFixed(2)} ms`,
            `Scene     ${this.engine.scene.name ?? "Untitled"}`,
            `Entities  ${this.engine.scene.entities.length}`,
            `Draws     ${info.render.calls}  |  Triangles ${info.render.triangles}`,
            `Physics   ${this.engine.physics.bodies.length} bodies, ${this.engine.physics.colliders.length} colliders`,
            position ? `Player    ${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}` : "Player    none",
            `State     ${this.engine.paused ? "paused" : "running"}`
        ].join("\n");
    }
    destroy() { this.element.remove(); }
}
