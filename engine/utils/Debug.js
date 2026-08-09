export class Debug {

    static enabled = true;

    static log(...args) {

        if (this.enabled) {
            console.log(
                "[RonEngine]",
                ...args
            );
        }
    }

    static warn(...args) {

        if (this.enabled) {
            console.warn(
                "[RonEngine]",
                ...args
            );
        }
    }

    static error(...args) {

        console.error(
            "[RonEngine]",
            ...args
        );
    }

    static debug(...args) { this.log(...args); }
}
