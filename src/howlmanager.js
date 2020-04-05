import { Howl } from 'howler';

const howls = {};
let timeline;
const timeouts = [];
let startTime = 0;
let pauseTime = 0;
let elapsedTimeFromStart = 0;

function onLoad(sound) {
  sound.duration = howls[sound.name].duration();
}

export function setup(_timeline) {
  this.timeline = _timeline;
  for (const sound of timeline.sounds) {
    howls[sound.name] = new Howl({
      src: [sound.name],
      preload: true,
      onload: onLoad.bind(null, sound),
    });
  }
}

export function play() {
  seekAt(0);
}

export function stop() {
  console.log('stop');
  startTime = 0;
  pauseTime = 0;
  for (const sound of timeline.sounds) {
    howls[sound.name].stop();
    howls[sound.name].load();
  }
  for (const timeout of timeouts) {
    clearTimeout(timeout);
  }
}

export function pause() {
  console.log('pause');
  pauseTime = new Date().getTime();
  stop();
  elapsedTimeFromStart = pauseTime - startTime;
  console.log(elapsedTimeFromStart);
}

export function seekAt(seconds) {
  this.stop();
  for (const sound of timeline.sounds) {
    if (sound.sec <= seconds) {
      if (sound.sec + sound.duration > seconds) {
        console.log('starting: ', sound.name, ' from sec: ', seconds - sound.sec);
        howls[sound.name].seek(seconds - sound.sec);
        howls[sound.name].play();
      }
    }
    if (sound.sec > seconds) {
      const timeout = setTimeout((sound) => {
        console.log('starting: ', sound.name);
        howls[sound.name].seek(0);
        howls[sound.name].play();
      }, Math.max(sound.sec * 1000 - seconds * 1000, 0), sound);
      timeouts.push(timeout);
    }
  }
}
