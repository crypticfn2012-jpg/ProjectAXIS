export class Time {
    static delta = 0;
    static elapsed = 0;
    static fps = 60;
    static timeScale = 1;
    static #last = null;

    static reset(now = performance.now()) {
        this.#last = now;
        this.delta = 0;
    }

    static update(now = performance.now()) {
        if (this.#last === null) this.reset(now);
        this.delta = Math.min((now - this.#last) / 1000, 0.1) * this.timeScale;
        this.#last = now;
        this.elapsed += this.delta;
        this.fps = this.delta > 0 ? 1 / this.delta : 60;
        return this.delta;
    }
}
