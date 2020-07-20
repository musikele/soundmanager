import { Howl, Howler } from 'howler';

const howls = {};
let timeline;
const timeouts = [];
let currentPosition = null;
let pauseTime = null;
let playing = false;
let loadedSounds = 0;

function onLoad(sound, resolve) {
  sound.duration = howls[sound.id].duration();
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
  Howler.unload();
  let failed = false;
  return new Promise((resolve, reject) => {
    timeline = _timeline;
    let id = 1; 
      for (const sound of timeline.sounds) {
        let start, length, name, sec, remainingProperties;
        ({start, length, name, sec, ...remainingProperties} = sound); 
        let needsSprite = start !== undefined && length !== undefined;
        sound.id = id;
        howls[id] = new Howl({
          src: [name],
          preload: true,
          onload: onLoad.bind(null, sound, resolve),
          onloaderror: () => {
            failed = true;
            reject(); 
          },
          sprite: needsSprite ? {
            __default: [Math.floor(sound.start*1000), Math.floor(sound.length*1000)]
          } : undefined,
          ...remainingProperties
        });
        id++;
      }

      if (failed) {
        for (const sound of timeline.sounds) {
          howls[sound.id].unload();
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
        howls[sound.id].seek(pauseTime - sound.sec);
        howls[sound.id].play();
        continue;
      }
    }
    if (sound.sec > pauseTime) {
      const timeout = setTimeout((sound) => {
        console.log('starting: ', sound.name);
        howls[sound.id].seek(0);
        howls[sound.id].play();
      }, Math.max(sound.sec * 1000 - pauseTime * 1000, 0), sound);
      timeouts.push(timeout);
      continue;
    }
  }
  playing = true;
}

export function stop() {
  console.log('stop');
  for (const sound of timeline.sounds) {
    howls[sound.id].stop();
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
        howls[sound.id].seek(seconds - sound.sec);
      }
    }
    if (sound.sec > seconds) {
      const timeout = setTimeout((sound) => {
        howls[sound.id].seek(0);
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