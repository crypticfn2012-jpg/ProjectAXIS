export class Mouse {

    constructor() {

        this.x = 0;
        this.y = 0;

        this.deltaX = 0;
        this.deltaY = 0;

        this.buttons = {};

        window.addEventListener(
            "mousemove",
            e => {

                this.x = e.clientX;
                this.y = e.clientY;

                if (
                    document.pointerLockElement
                ) {

                    this.deltaX +=
                        e.movementX;

                    this.deltaY +=
                        e.movementY;
                }
            }
        );

        window.addEventListener(
            "mousedown",
            e => {

                this.buttons[e.button] = true;
            }
        );

        window.addEventListener(
            "mouseup",
            e => {

                this.buttons[e.button] = false;
            }
        );
    }

    lock(element = document.body) {

        element.requestPointerLock();
    }

    unlock() {

        document.exitPointerLock();
    }

    isDown(button = 0) {

        return !!this.buttons[button];
    }

    update() {

        this.deltaX = 0;
        this.deltaY = 0;
    }
}