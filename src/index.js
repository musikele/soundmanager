import * as Scheduler from './scheduler';
import * as HowlManager from './howlmanager';

export function play() {
    Scheduler.start();
    HowlManager.play();
}

export function stop() {
    Scheduler.stop();
    HowlManager.stop();
}

export function pause() {
    Scheduler.pause();
    HowlManager.pause();
}

export function seek(second) {
    Scheduler.seek(second);
    //TODO howl ?
}