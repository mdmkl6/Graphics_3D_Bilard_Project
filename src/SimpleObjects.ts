import * as THREE from "three";
import { Physic } from "./Physic";
import { PhysicObject, position, scale, quaternion } from "./SimpleTypes";

function create_ball(
  scene: THREE.Scene,
  physic: Physic,
  pos: position = { x: 0, y: 0, z: 0 },
  texture: THREE.Texture = null,
  radius = 0.2,
  quat: quaternion = { x: 0, y: Math.PI, z: 0, w: 1 },
  mass = 1
): PhysicObject {
  return {
    mesh: create_ball_mesh(scene, texture, pos, radius, quat),
    rbody: physic.create_ball_rbody(mass, pos, radius, quat),
    lastpos: pos,
    inhole: false,
  };
}

function create_box_colider(
  scene: THREE.Scene,
  physic: Physic,
  pos: position = { x: 0, y: 0, z: 0 },
  scale: scale = { x: 1, y: 1, z: 1 },
  quat: quaternion = { x: 0, y: 0, z: 0, w: 1 },
  debug = false,
  mass = 0
): void {
  if (debug) create_box_mesh(scene, pos, scale, quat);
  physic.create_box_rbody(mass, pos, scale, quat);
}

function create_stick_mesh(
  scene: THREE.Scene,
  pos: position,
  quat: quaternion,
  radius: number,
  height: number
): THREE.Mesh {
  let mesh: THREE.Mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height),
    new THREE.MeshPhongMaterial({ color: 0x0000ff })
  );
  mesh = add_mesh(mesh, scene, pos, quat, false);
  return mesh;
}

function create_ball_mesh(
  scene: THREE.Scene,
  texture: THREE.Texture,
  pos: position,
  radius: number,
  quat: quaternion
): THREE.Mesh {
  let mesh: THREE.Mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius),
    new THREE.MeshPhongMaterial({ map: texture })
  );
  mesh = add_mesh(mesh, scene, pos, quat);
  return mesh;
}

function create_box_mesh(scene: THREE.Scene, pos: position, scale: scale, quat: quaternion): THREE.Mesh {
  let mesh: THREE.Mesh = new THREE.Mesh(
    new THREE.BoxGeometry(scale.x, scale.y, scale.z),
    new THREE.MeshPhongMaterial({ color: 0xff0000 })
  );
  mesh = add_mesh(mesh, scene, pos, quat);
  return mesh;
}

function add_mesh(mesh: THREE.Mesh, scene: THREE.Scene, pos: position, quat: quaternion, add = true): THREE.Mesh {
  mesh.position.set(pos.x, pos.y, pos.z);
  mesh.quaternion.set(quat.x, quat.y, quat.z, quat.w);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (add) scene.add(mesh);
  return mesh;
}

export { create_ball, create_box_colider, create_stick_mesh };
