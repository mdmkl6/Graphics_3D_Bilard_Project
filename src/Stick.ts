import * as THREE from "three";
import { create_stick_mesh } from "./SimpleObjects";
import { Physic } from "./Physic";
import Ammo from "ammojs-typed";
import Gui from "./Gui";

export default class Stick {
  mesh: THREE.Group = null;
  rbody: Ammo.btRigidBody = null;

  ms: Ammo.btMotionState = null;
  tmpTrans: Ammo.btTransform = null;
  tmpPos: Ammo.btVector3 = null;
  tmpQuat: Ammo.btQuaternion = null;

  main_ball_pos: THREE.Vector3 = null;

  radius = 0.03;
  height = 8;
  rotation = 0;
  power = 0;

  constructor(scene: THREE.Scene, physic: Physic) {
    const mesh: THREE.Mesh = create_stick_mesh(
      scene,
      { x: 0, y: this.height / 2, z: 0 },
      { x: 0, y: 0, z: 0, w: 1 },
      this.radius,
      this.height
    );
    const group = new THREE.Group();
    group.position.set(0, 0.3, 0);
    group.add(mesh);
    const group2 = new THREE.Group();
    group2.position.set(0, 0, 0);
    group2.rotateZ(Math.PI * 0.45);
    group2.add(group);
    this.mesh = new THREE.Group();
    this.mesh.position.set(0, 0, 0);
    this.mesh.add(group2);
    this.mesh.position.set(0, -20, 0);
    scene.add(this.mesh);

    this.rbody = physic.create_cylinder_rbody({ x: 0, y: -20, z: 0 });
    this.ms = this.rbody.getMotionState();
    this.tmpTrans = new physic.ammoClone.btTransform();
    this.tmpPos = new physic.ammoClone.btVector3();
    this.tmpQuat = new physic.ammoClone.btQuaternion(0, 0, 0, 1);

    this.main_ball_pos = new THREE.Vector3();
  }

  to_ball_position(pos: THREE.Vector3): void {
    this.main_ball_pos.set(pos.x, pos.y, pos.z);
    this.mesh.position.set(pos.x, pos.y, pos.z);
  }

  add_z(z: number): void {
    this.mesh.children[0].position.z = this.my_clamp(this.mesh.children[0].position.z + z);
  }

  add_y(y: number): void {
    this.mesh.children[0].position.y = this.my_clamp(this.mesh.children[0].position.y + y);
  }

  reset_yz() {
    this.mesh.children[0].position.y = 0;
    this.mesh.children[0].position.z = 0;
  }

  rotate(r: number): void {
    this.mesh.rotateY(r);
    this.rotation += r;
  }

  stretch(n: number): void {
    this.power = Math.max(0, Math.min(this.power + n, 10));
    this.mesh.children[0].children[0].position.y = 0.3 + this.power;
    Gui.set_power(this.power);
    console.log(this.power);
  }

  init_shoot(): void {
    Gui.set_power(0);
    const pos = new THREE.Vector3();
    this.mesh.children[0].children[0].getWorldPosition(pos);

    this.tmpPos.setValue(pos.x, pos.y, pos.z);
    this.tmpQuat.setValue(0, this.rotation, 0, 1);

    this.tmpTrans.setOrigin(this.tmpPos);
    this.tmpTrans.setRotation(this.tmpQuat);
    this.rbody.getMotionState().setWorldTransform(this.tmpTrans);
  }

  shoot(): boolean {
    if (this.mesh.children[0].children[0].position.y < 0) {
      this.reset();
      return true;
    } else {
      this.mesh.children[0].children[0].position.y -= this.power / 50;
      const pos = new THREE.Vector3();
      this.mesh.children[0].children[0].getWorldPosition(pos);
      this.tmpPos.setValue(pos.x, pos.y, pos.z);
      this.tmpTrans.setOrigin(this.tmpPos);
      this.rbody.getMotionState().setWorldTransform(this.tmpTrans);
      return false;
    }
  }

  reset(): void {
    this.tmpPos.setValue(0, -20, 0);
    this.tmpTrans.setOrigin(this.tmpPos);
    this.rbody.getMotionState().setWorldTransform(this.tmpTrans);

    this.mesh.position.set(0, -20, 0);
    this.mesh.children[0].children[0].position.y = 0.3;
    this.reset_yz();
    this.rotate(-this.rotation);
    this.power = 0;
  }

  my_clamp(stick_pos: number): number {
    return Math.max(-0.1, Math.min(stick_pos, 0.1));
  }
}
