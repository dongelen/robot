
import carImage from "/public/car3.png";
import carBacklightImage from "/public/car_backlights.png";
import headLightsImage from "/public/lights.png";

import background_level1 from "/public/background_level1.png"
import background_level2 from "/public/background_level2.png"
import background_level3 from "/public/background_level3.png"
import background_level4 from "/public/background_level4.png"
import background_level5 from "/public/background_level5.png"



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
    console.log (robot.rotation);
    this.isGoalMet = robot.rotation === 225;
  }
}

class GoalLevel4 extends Goal{
  finishedAt (robot: Car, endPosition: Position ) {
    this.isGoalMet = endPosition.x == 9 && endPosition.y == 5;
  }
}

class GoalLevel5 extends Goal {
  finishedAt (robot: Car, endPosition: Position ) {
    this.isGoalMet = endPosition.x == 9 && endPosition.y == 3;
  }

}


enum CellType {
  Normal, WallLeft, WallTop, WallRight, WallBottom
}

// export class CellType {

// }

export class Level {
  public fields: CellType[][] = [];
  private canvases: HTMLElement[];
  private canvas: HTMLCanvasElement;
  readonly car: Car;

  private numberOColumns = 3;
  private numberOfRows = 3;

  protected audioEndID : string  = "j1";

  constructor(
    goal: Goal,
    canvases: HTMLElement[],
    numberOfRows: number,
    numberOfColumns: number
  ) {
    this.canvas = canvases[0] as HTMLCanvasElement;
    this.numberOColumns = numberOfColumns;
    this.numberOfRows = numberOfRows;
    let width = this.canvas.width;
    let height = this.canvas.height;
    let columnWidth = width / this.numberOColumns;
    let rowHeight = height / this.numberOfRows;
    this.canvases = canvases;

    let robotElement = canvases[1];

    this.car = new Car(this, goal, this.canvases[1], { x: 0, y: 0 }, columnWidth, rowHeight);

    for (let row = 0; row != this.numberOfRows; row ++) {
      var newRow : CellType[] = [] 
      for (let column =0; column != this.numberOColumns; column++) {
        newRow.push (CellType.Normal);
      }
      this.fields.push (newRow);  
    } 

    this.afterInit();

  }

  /*
  Gets called after the constructor
  */
  protected afterInit () {

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


  preloadSounds () {
    let soundElements = [this.audioEndID, "honk"];

    for (let element of soundElements) {
      let sound = document.getElementById (element) as HTMLAudioElement;
      sound.play();  
      sound.pause();
    }
  }

  endSound () : string {
    return this.audioEndID;
  }


  wallWhileMoving (from: Position, to : Position) : boolean {
    /* 
    Wall als: 
    - Nieuwe positie buiten veld
    - Horizontale beweging: 
    - Diagonaal: vier posities checken
    - Verticaal 
    */

    
    // Er is een muur als to buiten het veld ligt

    let outsideField = to.x >= this.numberOColumns || to.x < 0 || to.y >= this.numberOfRows || to.y < 0
    if (outsideField) {
      return true;
    }

    // Check  op horizontale move
    if (from.y == to.y) {
      if (from.x < to.x) { // naar rechts
        let wall = this.fields[to.y][from.x] === CellType.WallRight || this.fields[to.y][to.x] === CellType.WallLeft;
        
        
        return wall;
      }
      else { // naar links

        return this.fields[to.y][to.x] === CellType.WallLeft || this.fields[to.y][to.x] === CellType.WallRight;
      }
    }
    
    // Check op verticale move
    if (from.x == to.x) {
      if (from.y < to.y) {

        return this.fields[from.y][to.x] === CellType.WallBottom || this.fields[to.y][to.x] === CellType.WallTop;
      }
      else { // omhoog
        return this.fields[from.y][to.x] === CellType.WallTop || this.fields[to.y][to.x] === CellType.WallBottom;
      }
    }

    // Check op diagonaal rijden
    if (from.x < to.x) {
      if (from.y < to.y) {

        return this.fields[from.y][from.x] == CellType.WallRight || this.fields[from.y][to.x] == CellType.WallLeft ||
          this.fields[to.y][from.x] == CellType.WallTop || this.fields[to.y][to.x] == CellType.WallTop ||
          this.fields[from.y][from.x] == CellType.WallBottom || this.fields[from.y][to.x] == CellType.WallBottom
      }

      // Hier zou meer moeten worden afhandeld, maar dat laat ik zitten als easter egg.
    }


    return false;
  }

  setEndSound (url : string) {
    let audio = document.createElement ("audio") as HTMLAudioElement;
    this.audioEndID = "new_end";
    audio.id = this.audioEndID;
    audio.src = url;

    document.getElementById ("app")?.appendChild (audio);
  }

  setHonkSound (url : string) {
    let audio = document.getElementById ("honk") as HTMLAudioElement;
    audio.src = url;
  }

  setRobotBackground (url : string) {
    let car = document.getElementById ("car") as HTMLDivElement;
    car.setAttribute("style", "background-image:url('"+url+"');");    
  }

}

class Level1 extends Level {

}

class Level2 extends Level {
  afterInit () {
    this.audioEndID = "j2";
  }

}

class Level3 extends Level {
  afterInit () {
    this.audioEndID = "j3";
  }
}

class Level4 extends Level {
  afterInit () {
    this.audioEndID = "j4";
  }
}

class Level5 extends Level {
  afterInit() {
    this.makeWallX (0, 1, 12, CellType.WallBottom);

    this.makeWallY (13, 0, 8, CellType.WallLeft);
    this.makeWallY (0, 2, 8, CellType.WallRight);
    
    this.makeWallX (5, 1, 9, CellType.WallBottom);
    this.makeWallY (11, 1, 7, CellType.WallLeft);

    this.makeWallX (1, 1, 11, CellType.WallBottom);

    this.makeWallX (2, 3, 10, CellType.WallBottom);


    // Inner
    this.makeWallY(3, 4, 6, CellType.WallRight);    
    this.makeWallY(4, 3, 5, CellType.WallRight);
    this.makeWallY(5, 4, 6, CellType.WallRight);
    this.makeWallY(6, 3, 5, CellType.WallRight);
    this.makeWallY(7, 4, 6, CellType.WallRight);
    this.makeWallY(8, 3, 5, CellType.WallRight);

    this.makeWallY(9, 3, 6, CellType.WallRight);
  }

  makeWallY (x : number , by: number, ey: number, wallType: CellType) {
    for (var y = by; y != ey; y++) {
      this.fields[y][x] = wallType;
    }

  }

  makeWallX (y: number, bx: number, ex: number, wallType: CellType) {
    for (var x = bx; x != ex; x++) {
      this.fields[y][x] = wallType;
    }

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
    this.currentLevel = this.makeLevel1 (this.gameElement);
    return this.currentLevel;
  }

  level2 () : Level {
    this.currentLevel = this.makeLevel2 (this.gameElement);
    return this.currentLevel;
  }

  level3 () : Level {
    this.currentLevel = this.makeLevel3 (this.gameElement);
    return this.currentLevel;
  }

  level4 () : Level {
    this.currentLevel = this.makeLevel4 (this.gameElement);
    return this.currentLevel;
  }

  bozz() : Level {
    this.currentLevel = this.makeLevel5 (this.gameElement);
    return this.currentLevel;
  }


  // Generates test level
  levelTest (): Level {
    this.currentLevel = this.makeLevel1 (this.gameElement);
    this.currentLevel.addWalls();

    return this.currentLevel;

  }


  private makeLevel1 (element: HTMLElement) {
    let code = this.createHTMLContainer(background_level1, 700, 200, 1, 3);
    element.innerHTML = code;

    let level1 = document.getElementById("layer1") as HTMLCanvasElement;
    let robot = document.getElementById("robot") as HTMLCanvasElement;
    
    let l = new Level1(
      new GoalLevel1(),
      [level1, robot],
      1,
      3
    );

    l.draw();

    return l;
  }

  private makeLevel2 (element: HTMLElement) {
    let nr = 2;
    let nc = 3
    let code = this.createHTMLContainer(background_level2, 700, 400, nr, nc);
    element.innerHTML = code;

    let level1 = document.getElementById("layer1") as HTMLCanvasElement;
    let robot = document.getElementById("robot") as HTMLCanvasElement;
    
    let l = new Level2(
      new GoalLevel2(),
      [level1, robot],
      nr,
      nc
    );
    
    l.draw();

    return l;
  }


  private makeLevel3 (element : HTMLElement) {
    let nr = 2;
    let nc = 3
    let code = this.createHTMLContainer(background_level3, 700, 400, nr, nc);
    element.innerHTML = code;

    let level1 = document.getElementById("layer1") as HTMLCanvasElement;
    let robot = document.getElementById("robot") as HTMLCanvasElement;
    
    let l = new Level3(
      new GoalLevel3(),
      [level1, robot],
      nr,
      nc
    );
    
    l.draw();

    return l;

  }

  private makeLevel4 (element : HTMLElement) {
    let nr = 8;
    let nc = 14;
    let code = this.createHTMLContainer(background_level4, 700, 400, nr, nc);
    element.innerHTML = code;

    let level1 = document.getElementById("layer1") as HTMLCanvasElement;
    let robot = document.getElementById("robot") as HTMLCanvasElement;
    
    let l = new Level4(
      new GoalLevel4(),
      [level1, robot],
      nr,
      nc
    );
    
    l.draw();

    return l;

  }

  private makeLevel5 (element : HTMLElement) {
    let nr = 8;
    let nc = 14;
    let code = this.createHTMLContainer(background_level5, 700, 400, nr, nc);
    element.innerHTML = code;

    let level1 = document.getElementById("layer1") as HTMLCanvasElement;
    let robot = document.getElementById("robot") as HTMLCanvasElement;
    
    let l = new Level5(
      new GoalLevel5(),
      [level1, robot],
      nr,
      nc
    );
    
    l.draw();

    return l;

  }


  createHTMLContainer(levelBackgroundImage: string, width: number, height: number, numberOfRows : number, numberOfColumns : number): string {
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

    let backgroundImage = levelBackgroundImage;

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
