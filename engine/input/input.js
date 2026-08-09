import { Keyboard } from "./Keyboard.js";
import { Mouse } from "./Mouse.js";
import { Gamepad } from "./Gamepad.js";

export class Input {

    constructor() {

        this.keyboard =
            new Keyboard();

        this.mouse =
            new Mouse();

        this.gamepad = new Gamepad();
    }

    update() {

        this.keyboard.update();

        this.mouse.update();
    }

    isKeyDown(key) {

        return this.keyboard.isDown(key);
    }

    isKeyPressed(key) {

        return this.keyboard.isPressed(key);
    }

    isMouseDown(button = 0) {

        return this.mouse.isDown(button);
    }

    isMouseButtonDown(button = 0) { return this.isMouseDown(button); }

    getMouseDelta() { return { x: this.mouse.deltaX, y: this.mouse.deltaY }; }

    lockMouse() {

        this.mouse.lock();
    }
}
