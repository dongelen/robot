import {game} from './level';

function repeatTimes (numberOfTimes: number, block: Function) {
    for (var i= 0; i != numberOfTimes; i++) {
        block();
    }    
}

function repeatUntilWall (block: Function ) {
    while (!car.seesWallInFront()) {
        block();
    }
}

let level4 = game.level5 ();
var car = level4.car;

car.turn ();
car.forward();

// Nu: 
// Uitleg repeat + walls toevoegen aan de robot, als hij een wall ziet gaat hij er niet doorheen
// En repeatuntilwall proberen



/*
Als je naar level2 wilt 

let level2 = game.level2();
let car = level2.car;
*/


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


