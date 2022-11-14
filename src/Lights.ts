import * as THREE from "three";
import { position } from "./SimpleTypes";

export default function ctrate_lights(scene: THREE.Scene, debug = false) {
  const positions: Array<position> = [
    { x: 15, y: 10, z: 8 },
    { x: -15, y: 10, z: 8 },
    { x: 15, y: 10, z: -8 },
    { x: -15, y: 10, z: -8 },
    { x: 0, y: 10, z: 0 },
  ];
  positions.forEach((pos) => {
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(pos.x, pos.y, pos.z);
    light.lookAt(pos.x, 0, pos.z);
    scene.add(light);
    if (debug) scene.add(new THREE.PointLightHelper(light, 0.5, 0xff9900));
  });
}
