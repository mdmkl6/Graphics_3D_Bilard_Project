import * as THREE from "three";
import Ammo from "ammojs-typed";

type position = { x: number; y: number; z: number };
type scale = { x: number; y: number; z: number };
type quaternion = { x: number; y: number; z: number; w: number };

type BoxDefinition = { pos: position; scale: scale; quat: quaternion };

type PhysicObject = {
  mesh: THREE.Mesh | THREE.Group;
  rbody: Ammo.btRigidBody;
  lastpos: position;
  inhole: boolean;
};

type PhysicObjectArray = Array<PhysicObject>;
type BoxDefinitionArray = Array<BoxDefinition>;

export type { BoxDefinitionArray, PhysicObjectArray, PhysicObject, position, scale, quaternion };
