import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";

export class Lighting {

    static ambient(
        scene,
        color = 0xffffff,
        intensity = 0.5
    ) {

        const light =
            new THREE.AmbientLight(
                color,
                intensity
            );

        scene.add(light);

        return light;
    }

    static sun(
        scene,
        position = [10,20,10],
        intensity = 2
    ) {

        const light =
            new THREE.DirectionalLight(
                0xffffff,
                intensity
            );

        light.position.set(
            ...position
        );

        light.castShadow = true;

        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;

        scene.add(light);

        return light;
    }

    static point(
        scene,
        position,
        color = 0xffffff,
        intensity = 2
    ) {

        const light =
            new THREE.PointLight(
                color,
                intensity
            );

        light.position.set(
            ...position
        );

        scene.add(light);

        return light;
    }
}