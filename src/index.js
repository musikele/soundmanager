import * as Scheduler from './scheduler';
import * as HowlManager from './howlmanager';

HowlManager.setTimerFunction(Scheduler.currentPosition);

export const setup = HowlManager.setup;
export const currentPosition = Scheduler.currentPosition;

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
    HowlManager.seekAt(second);
}