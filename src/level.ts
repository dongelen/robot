import anime from "animejs/lib/anime.es.js";
import carImage from "/public/car3.png";
import carBacklightImage from "/public/car_backlights.png";
import headLightsImage from "/public/lights.png";

import carSound from "/public/carsound.mp3";
import honkSound from "/public/honk.mp3";
import oempSound from "/public/oemp.mp3";
import { Robot } from "./robot";

export interface Position {
  x: number;
  y: number;
}


export class Goal {
  protected isGoalMet : Boolean = false;
  moved (_robot: Robot, _from: Position, _to: Position) {

  }

  finishedAt (_robot: Robot, _endPosition: Position ) {

  }

  isSatified () : Boolean {
    return this.isGoalMet;
  }
}

class GoalLevel1 extends Goal {
  finishedAt (_robot: Robot, endPosition: Position ) {
    console.log ("Goal level 1 aangeroepen");
    this.isGoalMet = endPosition.x == 2 && endPosition.y == 0;
  }
}
class GoalLevel2 extends Goal {
  private hitPosition : boolean = false;
  
  moved (_robot: Robot, _from: Position, to: Position) {
    this.hitPosition = this.hitPosition || (to.x == 1 && to.y == 2);
  }

  finishedAt (_robot: Robot, endPosition: Position ) {
    this.isGoalMet = this.hitPosition && endPosition.x == 2 && endPosition.y == 0;
  }
}


class GoalLevel3 extends GoalLevel2 {
  finishedAt (robot: Robot, endPosition: Position ) {
    super.finishedAt(robot, endPosition);
    this.isGoalMet = robot.rotation === 315;
  }
}


export class CellType {}

export class Level {
  public fields: [CellType] = [];
  private canvases: [HTMLCanvasElement];
  private canvas: HTMLCanvasElement;
  readonly robot: Robot;

  private numberOColumns = 3;
  private numberOfRows = 3;

  constructor(
    goal: Goal,
    canvases: [HTMLElement],
    numberOfRows: number,
    numberOfColumns: number
  ) {
    console.log("New level");
    this.canvas = canvases[0];
    this.fields = [new CellType()];
    this.numberOColumns = numberOfColumns;
    this.numberOfRows = numberOfRows;
    let width = this.canvas.width;
    let height = this.canvas.height;
    let columnWidth = width / this.numberOColumns;
    let rowHeight = height / this.numberOfRows;

    this.robot = new Robot(goal, canvases[1], { x: 0, y: 0 }, columnWidth, rowHeight);
  }

  draw() {
    let width = this.canvas.width;
    let height = this.canvas.height;

    let context = this.canvas.getContext("2d");

    let columnWidth = width / this.numberOColumns;
    let rowHeight = height / this.numberOfRows;
    context.strokeStyle = "#FF0000";

    for (let i = 0; i !== this.numberOColumns; i++) {
      for (let j = 0; j !== this.numberOfRows; j++) {
        context.beginPath();
        context.rect(i * columnWidth, j * rowHeight, columnWidth, rowHeight);
        context.stroke();
      }
    }

    this.robot.drawOnCanvas();
  }
}

export class Game {
  private height: number;
  private width: number;
  private numberOfColumns: number;
  private numberOfRows: number;

  constructor(
    width: number,
    height: number,
    numberOfColumns: number,
    numberOfRows: number
  ) {
    this.height = height;
    this.width = width;
    this.numberOfColumns = numberOfColumns;
    this.numberOfRows = numberOfRows;
  }

  makeLevel(levelNumber: number, element: HTMLElement): Level {
    let code = this.createHTMLContainer();
    element.innerHTML = code;

    let canvas1 = document.getElementById("layer1") as HTMLCanvasElement;
    let canvas2 = document.getElementById("robot") as HTMLCanvasElement;
    
    if (levelNumber == 0) {
      return this.makeLevel0(canvas1, canvas2);
    }

  }

  private makeLevel0 (layer1 :HTMLElement, robot: HTMLElement) {
    let l = new Level(
      new GoalLevel1(),
      [layer1, robot],
      this.numberOfColumns,
      this.numberOfRows
    );

    l.draw();
    let button = document.getElementById ("check");
    console.log ("Button");
    console.log (button);
    button.onclick = function () {
      l.robot.check();
    };

    return l;

  }

  createHTMLContainer(): string {
    let middle = this.width / this.numberOfColumns / 2 - 30;
    let verticalCenter = this.height / this.numberOfRows / 2 - 15;

    let centerHeadLights = verticalCenter + 40;
    let topHeadLights = middle - 36;
    let carWidthPx = "120px";
    let carHeightPx = "60px";
    
    let htmlCode = `
    

    <style> 
    #robot {
      width: ${carWidthPx};
      height: ${carHeightPx};
      left: ${middle};
      top: ${verticalCenter};
      position: relative;
  
    }

    #car {
      position: relative;
      background-image: url(${carImage});
      background-size: ${carWidthPx} ${carHeightPx}; 
      width: ${carWidthPx};
      height: ${carHeightPx};
    }
    #carbacklight {
      left: 0;
      top: 0;
      position: absolute;
      background-image: url(${carBacklightImage});
      background-size: ${carWidthPx} ${carHeightPx}; 
      width: ${carWidthPx};
      height: ${carHeightPx};
      opacity: 0;
    }

    #headlights {
      width: ${carWidthPx};
      height: ${carHeightPx};
      left: ${centerHeadLights};
      top: ${topHeadLights};
      position: absolute;
      opacity : 0;
      background-image: url(${headLightsImage});
      background-size: ${carWidthPx} ${carHeightPx}; 
    }

    #layer1 {
      //display: none;
    }

    body {
      background-color: black;
    }
    </style>
    <audio id="carsound">
    <source src="${carSound}"/>
    </audio>

    <audio id="honk">
    <source src="${honkSound}"/>
    </audio>
    
    <audio id="oemp">
    <source src="${oempSound}"/>
    </audio>

    <button id="check">Click me</button>
    <div style="position: relative;">
     <canvas id="layer1" width="${this.width}" height="${this.height}" 
       style="position: absolute; left: 0; top: 0; z-index: 0;"></canvas>

      <div id="robot">  
        <div id="headlights"></div>

        <div id="car"> 
          <div id="carbacklight"></div>

        </div>
      </div>
     </div>
     
    `;

    return htmlCode;
  }
}
