export class UI {

    constructor() {

        this.elements = new Map();

        this.container =
            document.createElement("div");

        this.container.id =
            "ron-engine-ui";

        this.container.style.position =
            "fixed";

        this.container.style.inset =
            "0";

        this.container.style.pointerEvents =
            "none";

        document.body.appendChild(
            this.container
        );
    }

    text(
        id,
        text,
        x = 20,
        y = 20
    ) {

        const element =
            document.createElement("div");

        element.textContent =
            text;

        element.style.position =
            "absolute";

        element.style.left =
            `${x}px`;

        element.style.top =
            `${y}px`;

        element.style.color =
            "white";

        element.style.fontFamily =
            "Arial";

        element.style.pointerEvents =
            "none";

        this.container.appendChild(
            element
        );

        this.elements.set(
            id,
            element
        );

        return element;
    }

    setText(id, text) {

        const element =
            this.elements.get(id);

        if (element) {
            element.textContent = text;
        }
    }

    button(
        id,
        text,
        x,
        y,
        callback
    ) {

        const button =
            document.createElement("button");

        button.textContent =
            text;

        button.style.position =
            "absolute";

        button.style.left =
            `${x}px`;

        button.style.top =
            `${y}px`;

        button.style.pointerEvents =
            "auto";

        button.onclick =
            callback;

        this.container.appendChild(
            button
        );

        this.elements.set(
            id,
            button
        );

        return button;
    }

    remove(id) {

        const element =
            this.elements.get(id);

        if (!element) return;

        element.remove();

        this.elements.delete(id);
    }
}