export class Time {

    static delta = 0;
    static elapsed = 0;
    static fps = 60;

    static last = performance.now();

    static update() {

        const now = performance.now();

        this.delta = Math.min(
            (now - this.last) / 1000,
            0.1
        );

        this.last = now;

        this.elapsed += this.delta;

        this.fps = this.delta > 0
            ? 1 / this.delta
            : 60;
    }
}