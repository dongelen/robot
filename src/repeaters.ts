export function repeatTimes (numberOfTimes: number, block: Function) {
    for (var i= 0; i != numberOfTimes; i++) {
        block();
    }    
}

export function repeatUntilWall (block: Function ) {
    while (!car.seesWallInFront()) {
        block();
    }
}