import {game} from './level';

let level1 = game.level1 ();

level1.setHonkSound ("http://soundbible.com/grab.php?id=669&type=mp3");
level1.setEndSound("http://soundbible.com/grab.php?id=2214&type=mp3");

// Nu nog de auto customizen




var car = level1.car;
car.speed = 1000;
car.honk();
car.forward();
car.forward();




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


