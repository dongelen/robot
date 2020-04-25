
import carImage from "/public/car3.png";
import carBacklightImage from "/public/car_backlights.png";
import headLightsImage from "/public/lights.png";

import background_level1 from "/public/background_level1.png"
import background_level2 from "/public/background_level2.png"



import carSound from "/public/carsound.mp3";
import honkSound from "/public/honk.mp3";
import j1 from "/public/j1.mp3";
import j2 from "/public/j2.mp3";
import j3 from "/public/j3.mp3";
import j4 from "/public/j4.mp3";


import { Robot as Car } from "./robot";

export interface Position {
  x: number;
  y: number;
}


export class Goal {
  protected isGoalMet : Boolean = false;
  moved (_robot: Car, _from: Position, _to: Position) {

  }

  finishedAt (_robot: Car, _endPosition: Position ) {

  }

  isSatified () : Boolean {
    return this.isGoalMet;
  }
}

class GoalLevel1 extends Goal {
  finishedAt (_robot: Car, endPosition: Position ) {
    this.isGoalMet = endPosition.x == 2 && endPosition.y == 0;
  }
}
class GoalLevel2 extends Goal {
  private hitPosition : boolean = false;
  
  moved (_robot: Car, _from: Position, to: Position) {    
    this.hitPosition = this.hitPosition || (to.x == 1 && to.y == 1);
  }

  finishedAt (_robot: Car, endPosition: Position ) {
    this.isGoalMet = this.hitPosition && endPosition.x == 2 && endPosition.y == 0;
  }
}


class GoalLevel3 extends GoalLevel2 {
  finishedAt (robot: Car, endPosition: Position ) {
    super.finishedAt(robot, endPosition);
    this.isGoalMet = robot.rotation === 315;
  }
}


export class CellType {}

export class Level {
  public fields: CellType[] = [];
  private canvases: HTMLElement[];
  private canvas: HTMLCanvasElement;
  readonly car: Car;

  private numberOColumns = 3;
  private numberOfRows = 3;

  constructor(
    goal: Goal,
    canvases: HTMLElement[],
    numberOfRows: number,
    numberOfColumns: number
  ) {
    this.canvas = canvases[0] as HTMLCanvasElement;
    this.fields = [new CellType()];
    this.numberOColumns = numberOfColumns;
    this.numberOfRows = numberOfRows;
    let width = this.canvas.width;
    let height = this.canvas.height;
    let columnWidth = width / this.numberOColumns;
    let rowHeight = height / this.numberOfRows;
    this.canvases = canvases;

    let robotElement = canvases[1];

    this.car = new Car(goal, this.canvases[1], { x: 0, y: 0 }, columnWidth, rowHeight);
  }

  draw(drawBones = false) {
    if (drawBones) {
      let width = this.canvas.width;
      let height = this.canvas.height;

      let context = this.canvas.getContext("2d")!;


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
    }

    this.car.drawOnCanvas();
  }
}

export class Game {
  private gameElement : HTMLElement;
  public currentLevel : Level;

  constructor(
    element : HTMLElement, 
  ) {
    this.gameElement = element;
    this.currentLevel = this.level1();
  }


  level1 () : Level {
    this.currentLevel = this.makeLevel0 (this.gameElement);
    return this.currentLevel;
  }

  level2 () : Level {
    this.currentLevel = this.makeLevel1 (this.gameElement);
    return this.currentLevel;
  }



  private makeLevel0 (element: HTMLElement) {
    let code = this.createHTMLContainer(700, 200, 1, 3);
    element.innerHTML = code;

    let level1 = document.getElementById("layer1") as HTMLCanvasElement;
    let robot = document.getElementById("robot") as HTMLCanvasElement;
    
    let l = new Level(
      new GoalLevel1(),
      [level1, robot],
      1,
      3
    );

    l.draw();

    return l;
  }

  private makeLevel1 (element: HTMLElement) {
    let nr = 2;
    let nc = 3
    let code = this.createHTMLContainer(700, 400, nr, nc);
    element.innerHTML = code;

    let level1 = document.getElementById("layer1") as HTMLCanvasElement;
    let robot = document.getElementById("robot") as HTMLCanvasElement;
    
    let l = new Level(
      new GoalLevel2(),
      [level1, robot],
      nr,
      nc
    );

    l.draw();

    return l;

  }


  createHTMLContainer(width: number, height: number, numberOfRows : number, numberOfColumns : number): string {
    let carWidth = width / 2 / numberOfColumns;
    let carHeight = carWidth / 2;

    let middle = width / numberOfColumns / 2 - carWidth / 2;
    let verticalCenter = height / numberOfRows / 2 - carHeight / 2;

    let centerHeadLights = verticalCenter ;
    let topHeadLights = middle - carHeight;

    
    let carWidthPx = carWidth + "px";
    let carHeightPx = carHeight + "px";
    
    let widthPx = width + "px";
    let heightPx = height + "px";

    let backgroundImage = background_level1;

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
      background-image: url(${backgroundImage});
      background-size: ${widthPx} ${heightPx};
    }
    h1 {
      color: white;
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
    
    <audio id="j1">
    <source src="${j1}"/>
    </audio>

    <audio id="j2">
    <source src="${j2}"/>
    </audio>

    <audio id="j3">
    <source src="${j3}"/>
    </audio>

    <audio id="j4">
    <source src="${j4}"/>
    </audio>
    <h1>Roadtrippin</h1>

    <div style="position: relative;">
    
     <canvas id="layer1" width="${width}" height="${height}" 
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

let game = new Game(document.getElementById("app") as HTMLElement, 700, 700, 3, 3);


window.addEventListener("mousedown",function(event) {
  game.currentLevel.car.go();
 });

export { game };
