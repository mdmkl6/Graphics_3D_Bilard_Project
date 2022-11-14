import BasicScene from "./BasicScene";
import Physic from "./Physic";
import { PhysicObjectArray } from "./SimpleTypes";
import create_table from "./Table";
import GameController from "./GameController";
import ctrate_lights from "./Lights";
import Gui from "./Gui";

const scene = new BasicScene();
let gameController: GameController = null;
Gui.init();

const PhysicObjects: PhysicObjectArray = [];
const physics = new Physic((physic) => {
  ctrate_lights(scene.scene, false);
  create_table(scene.scene, physic);
  gameController = new GameController(scene.scene, scene.orbitals, physic, PhysicObjects);
});
function loop() {
  scene.camera.updateProjectionMatrix();
  scene.renderer.render(scene.scene, scene.camera);
  if (physics.physicsWorld) {
    physics.update_physics(PhysicObjects);
  }
  if (gameController) {
    gameController.run();
  }
  scene.orbitals.update();
  requestAnimationFrame(loop);
}
loop();
