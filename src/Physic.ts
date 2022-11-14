import Ammo from "ammojs-typed";
import { PhysicObjectArray, PhysicObject, position, scale, quaternion } from "./SimpleTypes";

export default class Physic {
  ammoClone: typeof Ammo = null;
  tempTransform: Ammo.btTransform = null;
  physicsWorld: Ammo.btDiscreteDynamicsWorld = null;
  motionsum: number;

  Objects: Array<{ mesh; rbody }> = [];

  constructor(create_objects: (physic: Physic) => void) {
    Ammo().then((Ammo) => {
      this.ammoClone = Ammo;
      this.tempTransform = new Ammo.btTransform();
      this.setup_physics_world();
      create_objects(this);
    });
  }

  setup_physics_world(Ammo = this.ammoClone) {
    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    const overlappingPairCache = new Ammo.btDbvtBroadphase();
    const solver = new Ammo.btSequentialImpulseConstraintSolver();

    this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(
      dispatcher,
      overlappingPairCache,
      solver,
      collisionConfiguration
    );
    this.physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));
    console.log("physics wolt init");
  }

  create_cylinder_rbody(
    pos: position,
    mass = 0,
    radius = 0.15,
    quat: quaternion = { x: 0, y: 0, z: Math.PI, w: 1 },
    Ammo = this.ammoClone
  ): Ammo.btRigidBody {
    const shape = new Ammo.btCylinderShape(new Ammo.btVector3(radius, radius, radius));
    const rbody = this.create_kinetic_rbody(shape, mass, pos, quat, Ammo);
    return rbody;
  }

  create_ball_rbody(
    mass: number,
    pos: position,
    radius: number,
    quat: quaternion,
    Ammo = this.ammoClone
  ): Ammo.btRigidBody {
    const shape = new Ammo.btSphereShape(radius);
    const rbody = this.create_dynamic_rbody(shape, mass, pos, quat, Ammo);
    return rbody;
  }

  create_box_rbody(
    mass: number,
    pos: position,
    scale: scale,
    quat: quaternion,
    Ammo = this.ammoClone
  ): Ammo.btRigidBody {
    const shape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
    const rbody = this.create_dynamic_rbody(shape, mass, pos, quat, Ammo);
    return rbody;
  }

  create_dynamic_rbody(
    shape: Ammo.btBoxShape,
    mass: number,
    pos: position,
    quat: quaternion,
    Ammo = this.ammoClone
  ): Ammo.btRigidBody {
    const rbody = this.create_rbody(shape, mass, pos, quat, Ammo);
    rbody.setRollingFriction(0.03);
    rbody.setRestitution(0.8);
    this.physicsWorld.addRigidBody(rbody);
    return rbody;
  }

  create_kinetic_rbody(
    shape: Ammo.btBoxShape,
    mass: number,
    pos: position,
    quat: quaternion,
    Ammo = this.ammoClone
  ): Ammo.btRigidBody {
    const rbody = this.create_rbody(shape, mass, pos, quat, Ammo);
    rbody.setRollingFriction(0.03);
    rbody.setRestitution(0.8);

    rbody.setActivationState(4);
    rbody.setCollisionFlags(2);

    this.physicsWorld.addRigidBody(rbody);
    return rbody;
  }

  create_rbody(
    shape: Ammo.btBoxShape,
    mass: number,
    pos: position,
    quat: quaternion,
    Ammo = this.ammoClone
  ): Ammo.btRigidBody {
    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

    const motionState = new Ammo.btDefaultMotionState(transform);

    const localInnertia = new Ammo.btVector3(0, 0, 0);

    shape.setMargin(0.05);
    shape.calculateLocalInertia(mass, localInnertia);

    const rigidBodyInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInnertia);
    const rbody = new Ammo.btRigidBody(rigidBodyInfo);

    return rbody;
  }

  update_physics(objects: PhysicObjectArray) {
    this.physicsWorld.stepSimulation(0.1, 1);
    let motionsum = 0;
    objects.forEach((object: PhysicObject) => {
      const ms = object.rbody.getMotionState();
      if (ms) {
        ms.getWorldTransform(this.tempTransform);
        const pos = this.tempTransform.getOrigin();
        const quat = this.tempTransform.getRotation();
        motionsum +=
          Math.abs(pos.x() - object.lastpos.x) +
          Math.abs(pos.y() - object.lastpos.y) +
          Math.abs(pos.z() - object.lastpos.z);
        object.lastpos.x = pos.x();
        object.lastpos.y = pos.y();
        object.lastpos.z = pos.z();
        object.mesh.position.set(pos.x(), pos.y(), pos.z());
        object.mesh.quaternion.set(quat.x(), quat.y(), quat.z(), quat.w());
      }
    });
    this.motionsum = motionsum;
  }
}

export type { Physic };
