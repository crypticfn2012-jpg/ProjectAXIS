# Ron Engine

Ron Engine is a dependency-free (apart from Three.js loaded from a CDN) ES-module starter engine for static sites, including GitHub Pages.

Open `index.html` through a static web server (for example VS Code Live Server), then click the page to capture the mouse. Use WASD, Shift, and Space to move, sprint, and jump.

## Core API

```js
import { RonEngine, BoxCollider } from "./engine/RonEngine.js";

const engine = new RonEngine({ canvas, quality: "high" });
const player = engine.createEntity("Player");
player.addComponent(new BoxCollider(player));
engine.start();
```

`RonEngine` owns the render loop, fixed updates, pause/resume, scene, renderer, input, physics, assets, UI, raycasting, and disposal lifecycle. Components receive `update(delta)` and `fixedUpdate(delta)`.

For box collisions, add a `BoxCollider` to both entities. Set `dynamicCollider.isStatic = false` when it belongs to a `Rigidbody`; static colliders are resolved against rigidbodies. The included first-person controller has a configurable `groundHeight` for lightweight level-floor support.
