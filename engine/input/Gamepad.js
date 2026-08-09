export class Gamepad {
    get(index = 0) { return navigator.getGamepads?.()[index] ?? null; }
    isButtonDown(button, index = 0) { return !!this.get(index)?.buttons[button]?.pressed; }
    getAxis(axis, index = 0, deadZone = 0.15) {
        const value = this.get(index)?.axes[axis] ?? 0;
        return Math.abs(value) < deadZone ? 0 : value;
    }
}
