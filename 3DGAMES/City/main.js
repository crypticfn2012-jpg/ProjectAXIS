import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 4;

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHTING
const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(5, 5, 5);
scene.add(light1);

const light2 = new THREE.AmbientLight(0x404040);
scene.add(light2);

// CURRENT OBJECT
let mesh;

// MATERIAL
const material = new THREE.MeshStandardMaterial({
  color: 0x00ffcc,
  roughness: 0.4,
  metalness: 0.3
});

// SHAPE FUNCTION
window.setShape = function(type) {
  if (mesh) scene.remove(mesh);

  let geometry;

  switch(type) {
    case 'cube':
      geometry = new THREE.BoxGeometry();
      break;
    case 'sphere':
      geometry = new THREE.SphereGeometry(0.8, 32, 32);
      break;
    case 'torus':
      geometry = new THREE.TorusGeometry(0.6, 0.25, 32, 100);
      break;
    case 'cone':
      geometry = new THREE.ConeGeometry(0.7, 1.5, 32);
      break;
  }

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

// DEFAULT SHAPE
setShape('cube');

// COLOR PICKER
document.getElementById('colorPicker').addEventListener('input', (e) => {
  material.color.set(e.target.value);
});

// MOUSE ROTATION
let isDragging = false;
let previousMouse = { x: 0, y: 0 };

window.addEventListener('mousedown', () => isDragging = true);
window.addEventListener('mouseup', () => isDragging = false);

window.addEventListener('mousemove', (e) => {
  if (!isDragging || !mesh) return;

  const deltaX = e.clientX - previousMouse.x;
  const deltaY = e.clientY - previousMouse.y;

  mesh.rotation.y += deltaX * 0.01;
  mesh.rotation.x += deltaY * 0.01;

  previousMouse = { x: e.clientX, y: e.clientY };
});

// ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);

  if (mesh) {
    mesh.rotation.y += 0.005; // subtle idle spin
  }

  renderer.render(scene, camera);
}

animate();

// RESIZE
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
