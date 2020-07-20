import * as Scheduler from './scheduler';
import * as HowlManager from './howlmanager';
import { setDebug } from './logger';

if (document.location.href.includes('soundmanager-debug')) {
    setDebug(true);
}

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