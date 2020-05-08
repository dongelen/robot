import {game} from './level';


export function repeatNumberOfTimes (numberOfTimes: number, block: Function) {
    for (var i= 0; i != numberOfTimes; i++) {
        block();
    }    
}

export function repeatUntilWall (block: Function ) {
    let car = game.currentLevel.car;
    while (!car.seesWallInFront()) {
        block();
    }
}