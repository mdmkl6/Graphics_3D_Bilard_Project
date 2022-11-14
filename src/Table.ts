import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { Physic } from "./Physic";
import { create_box_colider } from "./SimpleObjects";
import { BoxDefinitionArray } from "./SimpleTypes";

export default function create_table(scene: THREE.Scene, physics: Physic) {
  const scale = 0.05;
  const debug = false;
  const boxes: BoxDefinitionArray = [
    { pos: { x: 0, y: -1, z: 0 }, scale: { x: 22, y: 2.55, z: 9.8 }, quat: { x: 0, y: 0, z: 0, w: 1 } },
    { pos: { x: 0, y: -2.2, z: 0 }, scale: { x: 22, y: 0.1, z: 12 }, quat: { x: 0, y: 0, z: 0, w: 1 } },
    { pos: { x: 5.05, y: -1, z: 5 }, scale: { x: 9.55, y: 2.55, z: 2 }, quat: { x: 0, y: 0, z: 0, w: 1 } },
    { pos: { x: 5.05, y: -1, z: -5 }, scale: { x: 9.55, y: 2.55, z: 2 }, quat: { x: 0, y: 0, z: 0, w: 1 } },
    { pos: { x: -5.05, y: -1, z: 5 }, scale: { x: 9.55, y: 2.55, z: 2 }, quat: { x: 0, y: 0, z: 0, w: 1 } },
    { pos: { x: -5.05, y: -1, z: -5 }, scale: { x: 9.55, y: 2.55, z: 2 }, quat: { x: 0, y: 0, z: 0, w: 1 } },
    { pos: { x: 0, y: -1, z: 4.7 }, scale: { x: 1, y: 2.55, z: 1 }, quat: { x: 0, y: 0, z: 0, w: 1 } },
    { pos: { x: 0, y: -1, z: -4.7 }, scale: { x: 1, y: 2.55, z: 1 }, quat: { x: 0, y: 0, z: 0, w: 1 } },
    { pos: { x: 10.5, y: -1, z: 0 }, scale: { x: 0.1, y: 3.8, z: 11 }, quat: { x: 0, y: 0, z: 0, w: 1 } },
    { pos: { x: -10.5, y: -1, z: 0 }, scale: { x: 0.1, y: 3.8, z: 11 }, quat: { x: 0, y: 0, z: 0, w: 1 } },
    { pos: { x: 5.5, y: -1, z: 5.6 }, scale: { x: 10, y: 3.8, z: 0.1 }, quat: { x: 0, y: 0, z: 0, w: 1 } },
    { pos: { x: 5.5, y: -1, z: -5.6 }, scale: { x: 10, y: 3.8, z: 0.1 }, quat: { x: 0, y: 0, z: 0, w: 1 } },
    { pos: { x: -5.5, y: -1, z: 5.6 }, scale: { x: 10, y: 3.8, z: 0.1 }, quat: { x: 0, y: 0, z: 0, w: 1 } },
    { pos: { x: -5.5, y: -1, z: -5.6 }, scale: { x: 10, y: 3.8, z: 0.1 }, quat: { x: 0, y: 0, z: 0, w: 1 } },
    { pos: { x: 0, y: -1, z: -5.8 }, scale: { x: 2, y: 3.8, z: 0.1 }, quat: { x: 0, y: 0, z: 0, w: 1 } },
    { pos: { x: 0, y: -1, z: 5.8 }, scale: { x: 2, y: 3.8, z: 0.1 }, quat: { x: 0, y: 0, z: 0, w: 1 } },
  ];
  boxes.forEach((box) => {
    create_box_colider(scene, physics, box.pos, box.scale, box.quat, debug);
  });
  new GLTFLoader().load("./models/table/scene.gltf", (gltfScene) => {
    gltfScene.scene.scale.set(scale, scale, scale);
    gltfScene.scene.traverse((n: THREE.Mesh | any) => {
      if (n.isMesh) {
        const newMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        newMaterial.map = n.material.map;
        newMaterial.color = n.material.color;
        n.material = newMaterial;
        n.castShadow = true;
        n.receiveShadow = true;
      }
    });
    scene.add(gltfScene.scene);
  });
}
