import * as THREE from "three";
import { RonEngine, CharacterController, BoxCollider, Component, Lighting, Material } from "../../engine/RonEngine.js";

const BACK_URL = "../../index.html";
const engine = new RonEngine({ quality: "high", maxPixelRatio: 2 });
const scene = engine.scene;
scene.name = "3D Playground";
scene.threeScene.background = new THREE.Color(0x071018);
scene.threeScene.fog = new THREE.Fog(0x071018, 22, 78);

const message = document.querySelector("#message");
const pauseScreen = document.querySelector("#pause");
let messageTimer = 0;
const showMessage = (text, seconds = 2.5) => { message.textContent = text; message.style.opacity = 1; messageTimer = seconds; };

Lighting.ambient(scene.threeScene, 0x91c9e8, 0.5);
const sun = Lighting.sun(scene.threeScene, [18, 24, 8], 2.2); sun.shadow.camera.left = sun.shadow.camera.bottom = -32; sun.shadow.camera.right = sun.shadow.camera.top = 32;

function staticBox(name, position, size, color, { emissive = 0, visible = true } = {}) {
  const entity = engine.createEntity(name); entity.setPosition(...position);
  entity.addComponent(new BoxCollider(entity, new THREE.Vector3(...size)));
  if (visible) { const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), emissive ? Material.emissive(color, emissive) : Material.basic(color)); mesh.castShadow = mesh.receiveShadow = true; entity.sceneObject.add(mesh); }
  return entity;
}

staticBox("Floor", [0, -0.5, 0], [54, 1, 54], 0x172b36);
for (const [x, z, sx, sz] of [[0,-27,54,1],[0,27,54,1],[-27,0,1,54],[27,0,1,54]]) staticBox("Boundary", [x, 2, z], [sx, 5, sz], 0x16313b);
staticBox("Platform A", [-9, 1.1, -8], [7, 2.2, 7], 0x2e4960);
staticBox("Platform B", [9, 2.2, 7], [6, 4.4, 6], 0x314e60);
staticBox("Ramp", [3, 0.55, -10], [7, 1.1, 5], 0x294655).sceneObject.rotation.z = -0.18;

const player = engine.createEntity("Player"); player.setPosition(0, 1.8, 12);
player.addComponent(new BoxCollider(player, new THREE.Vector3(0.8, 1.8, 0.8)));
const controller = player.addComponent(new CharacterController(player, engine.input, engine.camera, engine.physics));
controller.speed = 6; controller.sprintSpeed = 11; controller.jumpForce = 8.5;
engine.camera.follow(player);

class Rotator extends Component { constructor(entity, speed = 1) { super(entity); this.speed = speed; } update(delta) { this.entity.rotation.y += delta * this.speed; } }
class MovingPlatform extends Component { constructor(entity) { super(entity); this.origin = entity.position.clone(); this.phase = 0; } update(delta) { this.phase += delta; this.entity.position.x = this.origin.x + Math.sin(this.phase) * 5; } }

const beacon = engine.createEntity("Colour Beacon"); beacon.setPosition(-4, 1.5, 4); const beaconMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 2), Material.emissive(0x00ffcc, 0.4)); beaconMesh.castShadow = true; beacon.sceneObject.add(beaconMesh); beacon.addComponent(new Rotator(beacon, 0.75)); beacon.addComponent(new BoxCollider(beacon, new THREE.Vector3(2, 3, 2)));
const crate = staticBox("Destructible Crate", [5, 1, -1], [2, 2, 2], 0xe36f4f);
const bouncer = staticBox("Bounce Pad", [-3, 0.35, -4], [4, .7, 4], 0x7a4ff0, { emissive: .3 });
const moving = staticBox("Moving Platform", [-12, 2, 8], [5, .7, 5], 0x00b9a0, { emissive: .2 }); moving.addComponent(new MovingPlatform(moving));
const zone = staticBox("Test Zone", [12, .1, -10], [7, .2, 7], 0x1c4855, { visible: false });
const zoneMarker = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, .05, 32), new THREE.MeshBasicMaterial({ color:0x00e0b8, transparent:true, opacity:.18 })); zoneMarker.position.copy(zone.position); scene.threeScene.add(zoneMarker);

for (let i = 0; i < 22; i++) { const geometry = i % 3 === 0 ? new THREE.SphereGeometry(.5, 18, 12) : i % 3 === 1 ? new THREE.CylinderGeometry(.45,.45,1.3,12) : new THREE.BoxGeometry(1,1,1); const object = new THREE.Mesh(geometry, Material.metal([0x44d9ff,0xffc857,0xfa709a,0x78f08b][i % 4])); object.position.set((Math.random()-.5)*42, .7, (Math.random()-.5)*42); object.castShadow=true; scene.threeScene.add(object); }

const near = (entity, distance = 3) => player.position.distanceTo(entity.position) <= distance;
let zoneTriggered = false;
engine.onUpdate(delta => {
  if (messageTimer > 0 && (messageTimer -= delta) <= 0) message.style.opacity = 0;
  if (engine.input.isKeyPressed("KeyR")) { player.setPosition(0, 1.8, 12); controller.velocity.set(0,0,0); showMessage("Player reset"); }
  if (engine.input.isKeyPressed("KeyE")) {
    if (near(beacon)) { beaconMesh.material.color.setHSL(Math.random(), .85, .55); showMessage("Beacon colour changed!"); }
    else if (crate.active && near(crate)) { scene.remove(crate); showMessage("Crate dismantled."); }
    else showMessage("Nothing close enough to interact with.", 1.4);
  }
  if (near(bouncer, 2.6) && player.position.y <= controller.groundHeight + .08) { controller.velocity.y = 13; showMessage("Bounce!", .5); }
  if (!zoneTriggered && near(zone, 3.6)) { zoneTriggered = true; showMessage("You entered the test zone!"); }
});

window.addEventListener("click", () => { if (!engine.paused) engine.input.lockMouse(); });
window.addEventListener("keydown", event => { if (event.code !== "Escape") return; event.preventDefault(); if (engine.paused) { engine.resume(); pauseScreen.classList.remove("visible"); engine.input.lockMouse(); } else { engine.pause(); document.exitPointerLock(); pauseScreen.classList.add("visible"); } });
document.querySelector("#back").addEventListener("click", () => { window.location.href = BACK_URL; });
showMessage("Click anywhere to enter the playground.", 4);
engine.start();
