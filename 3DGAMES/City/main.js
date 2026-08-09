import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";


// ==========================================
// SCENE
// ==========================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x111111);


// ==========================================
// CAMERA
// ==========================================

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 0, 4);


// ==========================================
// RENDERER
// ==========================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.body.appendChild(renderer.domElement);


// ==========================================
// LIGHTING
// ==========================================

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.5
);

scene.add(ambientLight);


const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    2
);

directionalLight.position.set(
    5,
    5,
    5
);

scene.add(directionalLight);


// ==========================================
// MATERIAL
// ==========================================

const material = new THREE.MeshStandardMaterial({
    color: 0x00ffcc,
    roughness: 0.35,
    metalness: 0.25
});


// ==========================================
// CURRENT OBJECT
// ==========================================

let mesh = null;


// ==========================================
// CREATE SHAPE
// ==========================================

function setShape(type) {

    // Remove old object

    if (mesh) {

        scene.remove(mesh);

        mesh.geometry.dispose();

    }


    let geometry;


    switch (type) {

        case "cube":

            geometry = new THREE.BoxGeometry(
                1.6,
                1.6,
                1.6
            );

            break;


        case "sphere":

            geometry = new THREE.SphereGeometry(
                1,
                48,
                48
            );

            break;


        case "torus":

            geometry = new THREE.TorusGeometry(
                0.8,
                0.3,
                32,
                100
            );

            break;


        case "cone":

            geometry = new THREE.ConeGeometry(
                0.9,
                1.8,
                48
            );

            break;


        default:

            geometry = new THREE.BoxGeometry(
                1.6,
                1.6,
                1.6
            );

    }


    mesh = new THREE.Mesh(
        geometry,
        material
    );


    scene.add(mesh);

}


// ==========================================
// DEFAULT SHAPE
// ==========================================

setShape("cube");


// ==========================================
// BUTTONS
// ==========================================

document
    .querySelectorAll("#shape-buttons button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const shape =
                    button.dataset.shape;

                if (shape) {

                    setShape(shape);

                }

            }
        );

    });


// ==========================================
// COLOR PICKER
// ==========================================

const colorPicker =
    document.getElementById(
        "colorPicker"
    );


colorPicker.addEventListener(
    "input",
    event => {

        material.color.set(
            event.target.value
        );

    }
);


// ==========================================
// MOUSE ROTATION
// ==========================================

let dragging = false;

let lastX = 0;
let lastY = 0;


renderer.domElement.addEventListener(
    "pointerdown",
    event => {

        dragging = true;

        lastX = event.clientX;
        lastY = event.clientY;

        renderer.domElement.setPointerCapture(
            event.pointerId
        );

    }
);


renderer.domElement.addEventListener(
    "pointermove",
    event => {

        if (!dragging || !mesh) {
            return;
        }


        const dx =
            event.clientX - lastX;

        const dy =
            event.clientY - lastY;


        mesh.rotation.y +=
            dx * 0.01;

        mesh.rotation.x +=
            dy * 0.01;


        lastX = event.clientX;
        lastY = event.clientY;

    }
);


renderer.domElement.addEventListener(
    "pointerup",
    event => {

        dragging = false;

        renderer.domElement.releasePointerCapture(
            event.pointerId
        );

    }
);


// ==========================================
// TOUCH SUPPORT
// ==========================================

renderer.domElement.addEventListener(
    "pointercancel",
    () => {

        dragging = false;

    }
);


// ==========================================
// ANIMATION
// ==========================================

function animate() {

    requestAnimationFrame(
        animate
    );


    renderer.render(
        scene,
        camera
    );

}


animate();


// ==========================================
// RESIZE
// ==========================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);
