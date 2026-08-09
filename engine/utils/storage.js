export class Storage {

    static set(key, value) {

        localStorage.setItem(
            `ron-engine-${key}`,
            JSON.stringify(value)
        );
    }

    static get(key, fallback = null) {

        const value =
            localStorage.getItem(
                `ron-engine-${key}`
            );

        if (value === null) {
            return fallback;
        }

        try {

            return JSON.parse(value);

        } catch {

            return fallback;
        }
    }

    static remove(key) {

        localStorage.removeItem(
            `ron-engine-${key}`
        );
    }

    static delete(key) { this.remove(key); }

    static clear() {
        const prefix = "ron-engine-";
        Object.keys(localStorage).filter(key => key.startsWith(prefix)).forEach(key => localStorage.removeItem(key));
    }
}
