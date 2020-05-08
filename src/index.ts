import {game} from './level';
import {repeatNumberOfTimes} from './repeaters.ts'
import {repeatUntilWall} from './repeaters.ts'


let level5 = game.bozz ();
var car = level5.car;

repeatUntilWall (function() {
    car.forward();
})