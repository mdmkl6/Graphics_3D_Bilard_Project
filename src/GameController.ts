import * as THREE from "three";
import { Physic } from "./Physic";
import { PhysicObjectArray, PhysicObject, position } from "./SimpleTypes";
import { create_ball } from "./SimpleObjects";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stick from "./Stick";
import Gui from "./Gui";

enum GameState {
  init = 0,
  stick_positionig = 1,
  waiting = 2,
  init_schoot = 3,
  shoot = 4,
  motion_waiting = 5,
  game_logic = 6,
}

enum Player {
  full = 1,
  half = 0,
}

export default class GameController {
  scene: THREE.Scene = null;
  orbital: OrbitControls = null;
  physic: Physic = null;
  PhysicObjects: PhysicObjectArray = null;
  fullBalls: PhysicObjectArray = [];
  halfBalls: PhysicObjectArray = [];
  blackball: PhysicObject = null;
  mainball: PhysicObject = null;
  stick: Stick = null;
  gamestate: GameState = GameState.init;
  look_at_ball = false;
  capture_events = false;
  player: Player = Player.full;

  rotation_delta = 0.0005;
  move_delta = 0.0001;

  constructor(scene: THREE.Scene, orbital: OrbitControls, physic: Physic, PhysicObjects: PhysicObjectArray) {
    this.scene = scene;
    this.orbital = orbital;
    this.physic = physic;
    this.PhysicObjects = PhysicObjects;

    this.create_balls();
    this.create_events();
    this.stick = new Stick(scene, physic);
  }

  run() {
    if (this.gamestate === GameState.init && this.mainball) {
      this.stick.to_ball_position(this.mainball.mesh.position);
      this.gamestate = GameState.stick_positionig;
      this.switch_camera();
    } else if (this.gamestate === GameState.stick_positionig) {
      this.capture_events = true;
      this.gamestate = GameState.waiting;
    } else if (this.gamestate === GameState.init_schoot) {
      this.stick.init_shoot();
      this.gamestate = GameState.shoot;
    } else if (this.gamestate === GameState.shoot) {
      if (this.stick.shoot()) this.gamestate = GameState.motion_waiting;
    } else if (this.gamestate === GameState.motion_waiting) {
      if (this.physic.motionsum < 0.00005) this.gamestate = GameState.game_logic;
    } else if (this.gamestate === GameState.game_logic) {
      this.game_logic();
    }
  }

  switch_camera(): void {
    if (this.look_at_ball) {
      this.orbital.target = new THREE.Vector3(0, 0, 0);
      this.orbital.object.position.set(12, 12, 12);
      this.look_at_ball = false;
    } else {
      {
        this.camera_to_ball();
      }
    }
  }
  camera_to_ball(): void {
    this.orbital.target = new THREE.Vector3(this.mainball.lastpos.x, this.mainball.lastpos.y, this.mainball.lastpos.z);
    this.camera_position_to_ball();
    this.look_at_ball = true;
  }
  camera_position_to_ball(): void {
    const pos = new THREE.Vector3();
    this.stick.mesh.children[0].children[0].children[0].getWorldPosition(pos);
    this.orbital.object.position.set(pos.x, pos.y + 1, pos.z);
  }

  create_balls(): void {
    const balls_positions: Array<position> = [];
    for (let i = 0; i < 5; i++) {
      for (let j = i; j >= 0; j--) {
        balls_positions.push({ x: 4 + i * 0.35, y: 0.5, z: (j - 0.5 * i) * 0.4 });
      }
    }
    const textureloader = new THREE.TextureLoader();
    for (let i = 1; i <= 7; i++) {
      textureloader.load(`textures/balls/Ball${i}.jpg`, (tex: THREE.Texture) => {
        const pos: Array<position> = balls_positions.splice(Math.floor(Math.random() * balls_positions.length), 1);
        const balls: PhysicObject = create_ball(this.scene, this.physic, pos[0], tex);
        this.fullBalls.push(balls);
        this.PhysicObjects.push(balls);
      });
    }
    textureloader.load("textures/balls/Ball8.jpg", (tex: THREE.Texture) => {
      const pos: Array<position> = balls_positions.splice(Math.floor(Math.random() * balls_positions.length), 1);
      this.blackball = create_ball(this.scene, this.physic, pos[0], tex);
      this.PhysicObjects.push(this.blackball);
    });
    for (let i = 9; i <= 15; i++) {
      textureloader.load(`textures/balls/Ball${i}.jpg`, (tex: THREE.Texture) => {
        const pos: Array<position> = balls_positions.splice(Math.floor(Math.random() * balls_positions.length), 1);
        const balls: PhysicObject = create_ball(this.scene, this.physic, pos[0], tex);
        this.halfBalls.push(balls);
        this.PhysicObjects.push(balls);
      });
    }
    textureloader.load("textures/balls/BallCue.jpg", (tex: THREE.Texture) => {
      this.mainball = create_ball(this.scene, this.physic, { x: -4, y: 0.5, z: 0 }, tex);
      this.PhysicObjects.push(this.mainball);
    });
  }

  create_events(): void {
    window.addEventListener("keydown", (event) => {
      if (this.capture_events) {
        if (event.keyCode === 87) {
          //w
          this.move_delta = Math.min(this.move_delta + 0.0001, 0.02);
          this.stick.add_y(this.move_delta);
        }
        if (event.keyCode === 83) {
          //s
          this.move_delta = Math.min(this.move_delta + 0.0001, 0.02);
          this.stick.add_y(-this.move_delta);
        }
        if (event.keyCode === 65) {
          //a
          this.move_delta = Math.min(this.move_delta + 0.0001, 0.02);
          this.stick.add_z(-this.move_delta);
        }
        if (event.keyCode === 68) {
          //d
          this.move_delta = Math.min(this.move_delta + 0.0001, 0.02);
          this.stick.add_z(this.move_delta);
        }
        if (event.keyCode === 81) {
          //q
          this.rotation_delta = Math.min(this.rotation_delta + 0.0005, 0.1);
          this.stick.rotate(-this.rotation_delta);
          if (this.look_at_ball) this.camera_position_to_ball();
        }
        if (event.keyCode === 69) {
          //e
          this.rotation_delta = Math.min(this.rotation_delta + 0.0005, 0.1);
          this.stick.rotate(this.rotation_delta);
          if (this.look_at_ball) this.camera_position_to_ball();
        }
        if (event.keyCode === 82) {
          //r
          this.stick.reset_yz();
          if (this.look_at_ball) this.camera_position_to_ball();
        }
        if (event.keyCode === 67) {
          //c
          this.switch_camera();
        }
        if (event.keyCode === 32) {
          this.stick.stretch(0.1);
        }
      }
    });
    window.addEventListener("keyup", (event) => {
      if (this.capture_events) {
        if (event.keyCode === 87 || event.keyCode === 83 || event.keyCode === 65 || event.keyCode === 68)
          this.move_delta = 0.0001;
        if (event.keyCode === 81 || event.keyCode === 69) this.rotation_delta = 0.0005;
        if (event.keyCode === 32 && this.stick.power > 0) {
          this.capture_events = false;
          if (this.look_at_ball) this.switch_camera();
          this.gamestate = GameState.init_schoot;
        }
      }
    });
  }

  game_logic(): void {
    let balls: PhysicObjectArray = null;
    let enemy_balls: PhysicObjectArray = null;

    if (this.player == Player.full) {
      balls = this.fullBalls;
      enemy_balls = this.halfBalls;
    } else {
      balls = this.halfBalls;
      enemy_balls = this.fullBalls;
    }

    let my_one_in = false;
    let enemy_one_in = false;
    let all_in = true;

    balls.forEach((ball) => {
      if (!ball.inhole) {
        if (this.is_ball_in_hole(ball)) {
          my_one_in = true;
          ball.inhole = true;
        } else all_in = false;
      }
    });

    enemy_balls.forEach((ball) => {
      if (!ball.inhole) {
        if (this.is_ball_in_hole(ball)) {
          enemy_one_in = true;
          ball.inhole = true;
        }
      }
    });

    if (all_in && this.is_black_in_hole()) {
      this.game_win(true);
      return;
    }
    if (this.is_black_in_hole()) {
      this.game_win(false);
      return;
    }
    if (this.is_white_in_hole()) {
      this.reset_white();
      this.switch_turn();
      this.gamestate = GameState.init;
      return;
    }
    if (enemy_one_in) {
      this.switch_turn();
      this.gamestate = GameState.init;
      return;
    }
    if (!my_one_in) {
      this.switch_turn();
      this.gamestate = GameState.init;
      return;
    }
    this.gamestate = GameState.init;
  }

  switch_turn() {
    if (this.player === Player.half) {
      this.player = Player.full;
      Gui.set_turn(true);
    } else {
      this.player = Player.half;
      Gui.set_turn(false);
    }
  }

  is_white_in_hole(): boolean {
    return this.is_ball_in_hole(this.mainball);
  }

  is_black_in_hole(): boolean {
    return this.is_ball_in_hole(this.blackball);
  }

  is_ball_in_hole(ball: PhysicObject): boolean {
    if (ball.mesh.position.y < 0.4) return true;
    else return false;
  }

  game_win(win: boolean) {
    if (win) {
      if (this.player == Player.full) Gui.set_win(true);
      else Gui.set_win(false);
    } else {
      if (this.player == Player.full) Gui.set_win(false);
      else Gui.set_win(true);
    }
    this.gamestate = GameState.waiting;
  }

  reset_white() {
    this.physic.physicsWorld.removeRigidBody(this.mainball.rbody);
    this.physic.ammoClone.destroy(this.mainball.rbody);
    this.mainball.rbody = this.physic.create_ball_rbody(1, { x: 0, y: 0.5, z: 0 }, 0.2, {
      x: 0,
      y: Math.PI,
      z: 0,
      w: 1,
    });
  }
}
