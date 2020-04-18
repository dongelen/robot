import anime from "animejs/lib/anime.es.js";
import {Goal } from "./level";
import {Position} from "./level";

let speed = 1200;
// let speed = 500;

export class Robot {
    public position: Position;
    private element: Element;
    private widthCell: number;
    private heightCell: number;
  
    private animationTimeLine: any;
  
    public readonly rotation: number = 0;
    private isAnimationFinished = false;
  
    private goal: Goal;

    constructor(
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
        begin: function(anim) {
          console.log ("Iets gedaan");
          console.log (robot);
        }
      });
    }
  
    forward() {
      let oldPosition = this.position;
      this.position.x = this.position.x + this.calculateForwardXMovement();
      this.position.y = this.position.y + this.calculateForwardYMovement();

      this.goal.moved(this, oldPosition, this.position);
  
      this.animationTimeLine.add({
        targets: this.element,
        translateX: this.widthCell * this.position.x,
        translateY: this.heightCell * this.position.y,
        duration: speed,
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
        duration: speed,
        easing: "easeInOutQuad"
      });
    }
  
  
  
    turn(direction: number = 1) {
      let angle = direction < 0 ? -45 : 45;
      this.rotation = this.rotation + angle;
  
      this.animationTimeLine.add({
        targets: this.element,
        rotate: this.rotation,
        duration: speed,
        ease: "easeInOutQuad"
      });
    }
  
  
  
    findElement(name: string): HTMLElement {
      for (let element of this.element.childNodes) {
        if (element.id === name) {
          return element;
        }
      }
    }
  
    findElementIn(name: string, parentElement: HTMLElement): HTMLElement {
      for (let element of parentElement.childNodes) {
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
      let car = this.findElement("car")
      let carbacklight = this.findElementIn("carbacklight", car);
  
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
      let sound = document.getElementById ("honk");
  
      this.animationTimeLine.add ({
        targets: this.element,
        duration: 500,
        begin: function(anim) {
            sound.play();
        }
      });

    }

    happy () {
      let sound = document.getElementById ("oemp");
      sound.play();
    }
    spin (direction : number) {
      
      this.animationTimeLine.add({
        targets: this.element,
        rotate: 360,
        duration: 1500,
        ease: "easeInOutQuad"
      });
    }



    endAnimation = (anim) => {
      console.log ("%%%%%%%%%% End animation");
      console.log (this.position.x + " " + this.position.y);
      console.log (this);
      this.goal.finishedAt(this, this.position);

      if (this.goal.isSatified()) {
        console.log ("Doel bereikt!!");
        alert ("Gelukt!");
      }
      else {
        alert ("Mislukt");
      }
    }
  
    go() {    

      this.doeIets();      

      let robot = this; // hack

      this.animationTimeLine.add ({
        targets: this.element,
        duration: 1,
        begin: function(anim) {
          console.log ("Eind chekc");
          robot.goal.finishedAt(robot, robot.position);

          if (robot.goal.isSatified()) {
            console.log ("Doel bereikt!!");
            // alert ("Gelukt!");
            robot.happy();
          }
          else {
            alert ("Mislukt");
          }
        }
      });


      let sound = document.getElementById ("carsound");
      // sound.play();
  
      this.animationTimeLine.play();
    }
    drawOnCanvas() {
      let newLeft = this.position.x * 100;
      let newLeftString = newLeft.toString() + "px;";
      this.element.style.left = newLeftString;
    }
  }