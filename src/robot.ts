import anime from "animejs/lib/anime.es.js";
// import * as anime from 'animejs';

import {Goal, Level } from "./level";
import {Position} from "./level";


// let speed = 500;

class Timemout {
  private time = 0;
  private robot : Robot;
  constructor (time : number, robot: Robot) {
    this.time = time;
    this.robot = robot;
  }
  timeout() {
      setTimeout(() => {
          this.robot.check();
      }, this.time);
  } 
     
}

export class Robot {
    public position: Position;
    private element: Element;
    private widthCell: number;
    private heightCell: number;
  
    private animationTimeLine: any;
  
    public rotation: number = 0;
    public  speed = 500;

    private isAnimationFinished = false;
  
    private goal: Goal;
    private level : Level;
    private timeOut : Timemout |undefined   = undefined;

    
    constructor(
      level: Level,
      goal : Goal, 
      element: HTMLElement,
      position: Position,
      widthCell: number,
      heightCell: number
    ) {
      this.position = position;
      this.element = element;
      this.widthCell = widthCell;
      this.heightCell = heightCell;
      this.goal = goal;
      this.level = level;

      this.animationTimeLine = anime.timeline({
        autoplay: false
      });
    }
  
    private calculateForwardXMovement(): number {    
      if (this.rotation < 0) {
        this.rotation = 360 + this.rotation;
      }
      if (this.rotation >= 0 && this.rotation < 90) {
        return 1;
      } 
      else if (this.rotation === 90) {
        return 0;
      } 
      else if (this.rotation < 270) {
        return -1;
      }
      else if (this.rotation == 315) {
        return 1;
      }
      
      return 0;
    }
  
  
    private calculateForwardYMovement(): number {
      if (this.rotation >= 360) {
        this.rotation = this.rotation - 360;
      }
      if (this.rotation < 0) {
        this.rotation = 360 + this.rotation;
      }
  
      if (this.rotation === 0 || this.rotation === 180) {
        return 0;
      } 
      else if (this.rotation > 0 && this.rotation < 180) {
        return 1;
      }
  
      return -1;
    }
  
    private calculateBackwardXMovement(): number {
      if (this.rotation >= 0 && this.rotation < 90) {
        return -1;
      } else if (this.rotation === 90) {
        return 0;
      } else if (this.rotation < 270) {
        return 1;
      }
      return 0;
    }
  
    private calculateBackwardYMovement(): number {
      if (this.rotation === 0 || this.rotation === 180) {
        return 0;
      } else if (this.rotation > 0 && this.rotation < 180) {
        return -1;
      }
  
      return 1;
    }
  
    check () {
      this.goal.finishedAt(this, this.position);

      if (this.goal.isSatified()) {
        console.log ("Doel bereikt!!");
        // alert ("Gelukt!");
        this.happy();
      }
      else {
        alert ("Mislukt");
      }
    }
    doeIets () {
      let robot = this;
      this.animationTimeLine.add ({
        targets: this.element,
        duration: 1,
        begin: function(anim : any) {
          console.log ("Iets gedaan");
          console.log (robot);
        }
      });
    }
  
    forward() {
      if (this.seesWallInFront()) {
        console.log ("I see wall")
        // Zorg voor een verkeerde richting

        console.log (this.position);
        this.turn();
        this.spin(180);
        return
      }

      let oldPosition = this.position;
      this.position.x = this.position.x + this.calculateForwardXMovement();
      this.position.y = this.position.y + this.calculateForwardYMovement();

      this.goal.moved(this, oldPosition, this.position);
  
      this.animationTimeLine.add({
        targets: this.element,
        translateX: this.widthCell * this.position.x,
        translateY: this.heightCell * this.position.y,
        duration: this.speed,
        easing: "easeInOutQuad"
      });
    }
  
    backward() {
      let oldPosition = this.position;
      this.position.x = this.position.x + this.calculateBackwardXMovement();
      this.position.y = this.position.y + this.calculateBackwardYMovement();
      this.goal.moved(this, oldPosition, this.position);

      this.animationTimeLine.add({
        targets: this.element,
        translateX: this.widthCell * this.position.x,
        translateY: this.heightCell * this.position.y,
        duration: this.speed,
        easing: "easeInOutQuad"
      });
    }
  
  
  
    turn(direction: number = 1) {
      let angle = direction < 0 ? -45 : 45;
      this.rotation = this.rotation + angle;
  
      this.animationTimeLine.add({
        targets: this.element,
        rotate: this.rotation,
        duration: this.speed,
        ease: "easeInOutQuad"
      });
    }
  
  
  
    findElement(name: string): HTMLElement | undefined {
      for (const element of this.element.childNodes as any) {
        if (element.id === name) {
          return element;
        }
      }
    }
  
    findElementIn(name: string, parentElement: HTMLElement): HTMLElement| undefined {
      for (const element of parentElement.childNodes as any) {
        if (element.id === name) {
          return element;
        }
      }
    }
    headlights(on: boolean) {
      let headlights = this.findElement("headlights");
  
      let opacitiyGoal = on ? 1 : 0;
  
      this.animationTimeLine.add({
        targets: headlights,
        opacity: opacitiyGoal,
        duration: 2500,
        easing: "linear"
      });
    }
  
    backlights (on : boolean) {
      let car = this.findElement("car") as HTMLElement;
      let carbacklight = this.findElementIn("carbacklight", car) as HTMLElement;
  
      this.animationTimeLine.add({
        targets: carbacklight,
        opacity: on ? 1 : 0,
        duration: 500,
        easing: "linear"
      });
      
  
  
    }
  
    blinkHeadlights (times : number = 1) {
      let headlights = this.findElement("headlights");
  
      var frames = [];
      for (var i=0; i < times; i++) {
        frames.push ({opacity: 1});
        frames.push ({opacity: 0});
      }
  
      this.animationTimeLine.add (
      {
        targets: headlights,
        keyframes: frames,
        duration: 500,
        easing: "easeInOutSine",
        loop: true
  
      });
    }
  
    honk () {
      let sound = document.getElementById ("honk") as HTMLAudioElement;
  
      this.animationTimeLine.add ({
        targets: this.element,
        duration: 500,
        begin: function(anim : any) {
            sound.play();
        }
      });

    }

    seesWallInFront (debug :boolean = false) : boolean {
      let x = this.position.x + this.calculateForwardXMovement();
      let y = this.position.y + this.calculateForwardYMovement();

      if (debug) {
        console.log ("794qyr7yrehsdfighsiguhisdfghu")
        console.dir (this.position);
        console.dir ({x: x, y: y})
        console.log (this.rotation);
      }
      
      return this.level.wallWhileMoving(this.position, {x: x, y: y});
    }

    happy () {
      // let sounds = ["j1", "j2", "j3", "j4"];
      
      let soundName = this.level.endSound();

      let sound = document.getElementById (soundName) as HTMLAudioElement;
      sound.play();

      anime ({
        targets: this.element,
        rotate: 360,
        duration: 1500,
        scaleX: [
          { value: 4, duration: 100, delay: 500, easing: 'easeOutExpo' },
          { value: 1, duration: 500 },
          { value: 4, duration: 100, delay: 500, easing: 'easeOutExpo' },
          { value: 1, duration: 500 }
        ]
        
      });
    }

    spin (direction : number) {

      this.animationTimeLine.add({
        targets: this.element,
        rotate: 360,
        duration: 1500,
        ease: "easeInOutQuad"
      });
    }


    totalTime () : number {
      var total = 0;
      for (let child of this.animationTimeLine.children) {
        total = total + child.duration;
      }
      return total;
    }

    go() {    



      this.timeOut = new Timemout(this.totalTime() + 10, this);
      
      let robot = this; // hack

      // this.animationTimeLine.add ({
      //   targets: this.element,
      //   duration: 1,
      //   begin: function(anim) {
      //     console.log ("Eind chekc");
      //     // robot.goal.finishedAt(robot, robot.position);

      //     // if (robot.goal.isSatified()) {
      //     //   console.log ("Doel bereikt!!");
      //     //   // alert ("Gelukt!");
      //     //   robot.happy();
      //     // }
      //     // else {
      //     //   alert ("Mislukt");
      //     // }
      //   }
      // });


      this.level.preloadSounds();
      this.animationTimeLine.play();
      this.timeOut.timeout();
    }
    drawOnCanvas() {
      let divElement = this.element as HTMLDivElement;
      let newLeft = this.position.x * 100;
      let newLeftString = newLeft.toString() + "px;";
      divElement.style.left = newLeftString;
    }
  }