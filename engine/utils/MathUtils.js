export class MathUtils {

    static clamp(
        value,
        min,
        max
    ) {

        return Math.max(
            min,
            Math.min(max, value)
        );
    }

    static lerp(
        a,
        b,
        t
    ) {

        return a +
            (b - a) * t;
    }

    static randomRange(
        min,
        max
    ) {

        return Math.random() *
            (max - min) +
            min;
    }

    static degToRad(degrees) {

        return degrees *
            Math.PI /
            180;
    }

    static radToDeg(radians) {

        return radians *
            180 /
            Math.PI;
    }
}