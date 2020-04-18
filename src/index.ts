import { Game } from "./level.ts";
// import { __esModule } from "../dist/src.4b83b6bd";

let game = new Game(400, 400, 3, 3);
let level = game.makeLevel(0, document.getElementById("app") as HTMLElement);
let robot = level.robot;

window.addEventListener("mousedown",function(event){
    robot.go();
   });

// Vanaf hier is de student aan de beurt

// Meteen turn leidt tot een probleem!!
robot.blinkHeadlights(4)
robot.forward();
robot.backward();
robot.turn();
robot.turn();
robot.forward();
robot.forward();
robot.turn (-1);
robot.turn (-1);
robot.forward();
robot.forward();
robot.turn (-1);
// robot.turn (-1);


robot.forward();
robot.forward();
robot.turn();
robot.backlights (true);
// robot.forward();
// robot.turn(-1);
// robot.turn(-1);
// robot.forward();
// robot.forward();

// robot.spin(1);


