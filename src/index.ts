import {game} from './level';

let level1 = game.level2 ();

// level1.setHonkSound ("http://soundbible.com/grab.php?id=2218&type=mp3");
// level1.setEndSound("http://soundbible.com/grab.php?id=2210&type=mp3");

// Nu nog de auto customizen
// En het eind dansje



var car = level1.car;

console.log (car.position);
if (car.seesWallInFront ()) {
    car.blinkHeadlights(3);
}
car.speed = 100;
car.honk();
car.forward();



// Level met onzichtbare muren. 


// let level2 = game.level2();
// let car = level2.car;
// car.speed = 1000;

// car.forward();
// car.backward();

// car.turn();
// car.forward();
// car.turn(-1);
// car.turn(-1);

// car.forward();


