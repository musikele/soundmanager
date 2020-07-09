import { Howl } from 'howler';

const howls = {};
let timeline;
const timeouts = [];
let currentPosition = null;
let pauseTime = null;
let playing = false;
let loadedSounds = 0;

function onLoad(sound, resolve) {
  sound.duration = howls[sound.name].duration();
  if (sound.length !== undefined) {
    sound.duration = sound.length;
  }
  if (!sound.length || sound.length > sound.duration) {
    sound.length = sound.duration - sound.start;
  }
  loadedSounds++; 
  if (timeline.sounds.length === loadedSounds) {
    resolve();
  }
}

export function setup(_timeline) {
  let failed = false; 
  return new Promise((resolve, reject) => {
    timeline = _timeline;
      for (const sound of timeline.sounds) {
        let needsSprite = sound.start !== undefined && sound.length !== undefined;
        howls[sound.name] = new Howl({
          src: [sound.name],
          preload: true,
          onload: onLoad.bind(null, sound, resolve),
          onloaderror: () => {
            failed = true;
            reject(); 
          },
          sprite: needsSprite ? {
            __default: [Math.floor(sound.start*1000), Math.floor(sound.length*1000)]
          } : undefined
        });
      }

      if (failed) {
        for (const sound of timeline.sounds) {
          howls[sound.name].unload();
        }
      }
  }); 
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