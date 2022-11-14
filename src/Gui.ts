import { GUI, GUIController } from "dat.gui";

export default class Gui {
  static gui: GUI = null;
  static info_folder: GUI = null;
  static turn: GUIController = null;
  static power: GUIController = null;
  static init() {
    const sample = { "1": "" };
    Gui.gui = new GUI();
    const instruction_folder = Gui.gui.addFolder("Instructions");
    instruction_folder.open();
    instruction_folder.add(sample, "1").name("w,a,s,d - move stick on surface in front of ball");
    instruction_folder.add(sample, "1").name("q,e - rotate stick arround ball");
    instruction_folder.add(sample, "1").name("r - reset stick and camera position");
    instruction_folder.add(sample, "1").name("c - switch camera view");
    instruction_folder.__controllers.forEach((controller) => (controller.domElement.hidden = true));
    Gui.info_folder = Gui.gui.addFolder("Game Info");
    Gui.info_folder.open();
    Gui.turn = Gui.info_folder.add(sample, "1").name("Half Turn");
    Gui.power = Gui.info_folder.add(sample, "1");
    Gui.set_power(0);
    Gui.info_folder.__controllers.forEach((controller) => (controller.domElement.hidden = true));
  }

  static set_turn(n: boolean) {
    if (n) Gui.turn.name("Full Turn");
    else Gui.turn.name("Half Turn");
  }

  static set_power(power: number) {
    let str = "power : [";
    for (let i = 0; i < 20; i++) {
      if (i < power * 2) str += "|";
      else str += "_";
    }
    str += "]";
    Gui.power.name(str);
  }

  static set_win(win: boolean) {
    if (win) Gui.turn.name("Full Wins");
    else Gui.turn.name("Half Wins");
  }
}
