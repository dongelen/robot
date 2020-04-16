import { Game } from "./level.ts";

let game = new Game(400, 400, 3, 3);
let level = game.makeLevel(document.getElementById("app") as HTMLElement);
let robot = level.robot;



// Vanaf hier is de student aan de beurt

// Meteen turn leidt tot een probleem!!
robot.backlights (true);
robot.backlights (false);
robot.forward();
robot.turn(-1);
robot.go();

