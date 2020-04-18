import { Game } from "./level";

let game = new Game(400, 400, 3, 3);
let level = game.makeLevel(0, document.getElementById("app") as HTMLElement);
let robot = level.robot;

window.addEventListener("mousedown",function(event) {
    robot.go();
   });

// Vanaf hier is de student aan de beurt

// Meteen turn leidt tot een probleem!!
// robot.blinkHeadlights(4)
// robot.forward();
// robot.backward();
// robot.turn();
// robot.turn();
// robot.forward();
// robot.forward();
// robot.turn (-1);
// robot.turn (-1);
// robot.forward();
// robot.forward();
// robot.turn (-1);
// robot.turn (-1);


// robot.forward();
// robot.forward();
// robot.turn();
// robot.backlights (true);
robot.forward();

robot.forward();


// class Test {
      
//     timeout() {
//         setTimeout(() => {
//             console.log('Test');
//             this.timeout();
//         }, 3000);
//     } 
       
//  }
 
 
//  let t = new Test();
//  t.timeout();


