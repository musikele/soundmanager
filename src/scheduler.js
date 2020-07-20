import { log, getDebug } from './logger';

let time = 0;
let interval = null;
let startTime = 0;
let pausedTime = 0;
let seekTime = 0;

export function start(callback) {
  if (interval) {
    clearInterval(interval);
  }
  startTime = new Date().getTime() - (pausedTime * 1000);
  interval = setInterval(() => {
    if (typeof seekTime !== 'undefined') {
      startTime = new Date().getTime() - seekTime * 1000;
    }
    time = new Date().getTime() - startTime;
    seekTime = undefined;
  }, 50);
  pausedTime = 0;
  if (callback) callback();
}

export function stop(callback) {
  time = 0;
  pausedTime = 0;
  clearInterval(interval);
  if (callback) callback();
}

export function currentPosition() {
  return time / 1000;
}

export function pause(callback) {
  pausedTime = currentPosition();
  clearInterval(interval);
  if (callback) callback();
}

export function seek(seconds, callback) {
  seekTime = currentPosition();
  seekTime += seconds;
  if (seekTime < 0) seekTime = 0;
  time = seekTime * 1000;
  if (callback) callback();
}

if (getDebug()) {
  setTimeout(() => {
    log('time: ' + currentPosition());
  }, 1000);
}