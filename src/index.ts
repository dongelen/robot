import {game} from './level';
import {repeatTimes} from './repeaters.ts'
import {repeatUntilWall} from './repeaters.ts'


let level4 = game.level5 ();
var car = level4.car;
car.speed = 100;

// repeatTimes (10, function () {
//     car.forward();
// })

console.log ("v9");
repeatTimes (4, function () {
    repeatUntilWall (function () {
        car.forward();
    })

    car.turn();
    car.turn();
})

repeatUntilWall (function () {
    car.forward();
})
car.turn(-1);
car.turn(-1);

repeatUntilWall (function () {
    car.forward();
})

car.turn(-1);
car.turn(-1);

repeatUntilWall (function () {
    car.forward();
})

car.turn(-1);
car.turn(-1);


repeatUntilWall (function () {
    car.forward();
})

car.turn(-1);
car.turn(-1);


repeatUntilWall (function () {
    car.forward();
})

car.turn(-1);
car.turn(-1);


repeatUntilWall (function () {
    car.forward();
})

car.turn();
car.turn();

repeatUntilWall (function () {
    car.forward();
})

car.turn();
car.turn();

repeatUntilWall (function () {
    car.forward();
})

car.turn(-1);
car.turn(-1);

repeatUntilWall (function () {
    car.forward();
})

car.turn(-1);
car.turn(-1);

repeatUntilWall (function () {
    car.forward();
})

car.turn();
car.turn();

repeatUntilWall (function () {
    car.forward();
})


car.turn();
car.turn();

repeatUntilWall (function () {
    car.forward();
})


car.turn(-1);
car.turn(-1);

repeatUntilWall (function () {
    car.forward();
})

car.turn(-1);
car.turn(-1);

repeatUntilWall (function () {
    car.forward();
})

car.turn();
car.turn();

repeatUntilWall (function () {
    car.forward();
})

car.turn();
car.turn();

repeatUntilWall (function () {
    car.forward();
})


car.turn(-1);
car.turn(-1);

repeatUntilWall (function () {
    car.forward();
})

car.turn(-1);
car.turn(-1);

repeatUntilWall (function () {
    car.forward();
})

