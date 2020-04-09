import { Howl } from 'howler';

const howls = {};
let timeline;
const timeouts = [];
let currentPosition = null;
let pauseTime = null;
let playing = false;

function onLoad(sound) {
  sound.duration = howls[sound.name].duration();
}

export function setup(_timeline) {
  timeline = _timeline;
  for (const sound of timeline.sounds) {
    howls[sound.name] = new Howl({
      src: [sound.name],
      preload: true,
      onload: onLoad.bind(null, sound),
    });
  }
}

export function play() {
  if (pauseTime) {
    seekAt(pauseTime);
  } else {
    seekAt(0);
    pauseTime = 0;
  }
  
  for (const sound of timeline.sounds) {
    if (sound.sec <= pauseTime) {
      if (sound.sec + sound.duration > pauseTime) {
        console.log('starting: ', sound.name, ' from sec: ', pauseTime - sound.sec);
        howls[sound.name].seek(pauseTime - sound.sec);
        howls[sound.name].play();
      }
    }
    if (sound.sec > pauseTime) {
      const timeout = setTimeout((sound) => {
        console.log('starting: ', sound.name);
        howls[sound.name].seek(0);
        howls[sound.name].play();
      }, Math.max(sound.sec * 1000 - pauseTime * 1000, 0), sound);
      timeouts.push(timeout);
    }
  }
  playing = true;
}

export function stop() {
  console.log('stop');
  for (const sound of timeline.sounds) {
    howls[sound.name].stop();
  }
  for (const timeout of timeouts) {
    clearTimeout(timeout);
  }
  pauseTime = 0;
  playing = false;
}

export function pause() {
  console.log('pause');
  stop();
  pauseTime = currentPosition();
  playing = false;
}

export function seekAt(seconds) {
  const savePlaying = playing; 
  if (playing) {
    stop();
  }
  pauseTime = seconds;
  for (const sound of timeline.sounds) {
    if (sound.sec <= seconds) {
      if (sound.sec + sound.duration > seconds) {
        console.log('starting: ', sound.name, ' from sec: ', seconds - sound.sec);
        howls[sound.name].seek(seconds - sound.sec);
      }
    }
    if (sound.sec > seconds) {
      const timeout = setTimeout((sound) => {
        console.log('starting: ', sound.name);
        howls[sound.name].seek(0);
      }, Math.max(sound.sec * 1000 - seconds * 1000, 0), sound);
      timeouts.push(timeout);
    }
  }
  if (savePlaying) {
    play();
  }
}


export function setTimerFunction(fun) {
  currentPosition = fun;
}