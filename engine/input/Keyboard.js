export class Keyboard {

    constructor() {

        this.keys = {};

        this.previous = {};

        window.addEventListener(
            "keydown",
            e => {

                this.keys[e.code] = true;
            }
        );

        window.addEventListener(
            "keyup",
            e => {

                this.keys[e.code] = false;
            }
        );
    }

    update() {

        this.previous = {
            ...this.keys
        };
    }

    isDown(key) {

        return !!this.keys[key];
    }

    isPressed(key) {

        return (
            this.isDown(key) &&
            !this.previous[key]
        );
    }

    isReleased(key) {

        return (
            !this.isDown(key) &&
            this.previous[key]
        );
    }
}