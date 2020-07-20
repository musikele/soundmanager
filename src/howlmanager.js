import { Howl, Howler } from 'howler';
import { log } from './logger';

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
    log(`loaded ${timeline.sounds.length} sounds in timeline`);
  }
}

export function setup(_timeline) {
  Howler.unload();
  loadedSounds = 0;
  let failed = false;
  log('SETUP - loading sounds...');
  return new Promise((resolve, reject) => {
    timeline = _timeline;
    let id = 1; 
      for (const sound of timeline.sounds) {
        // eslint-disable-next-line no-unused-vars
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
        log(`sound: ${sound.name}`);
        log(sound);
        id++;
      }

      if (failed) {
        for (const sound of timeline.sounds) {
          log('failed to load some sounds!');
          howls[sound.id].unload();
        }
      }
  }); 
}

export function play() {
  if (pauseTime) {
    log(`PLAY starting - resuming from pause time: ${pauseTime}`);
    seekAt(pauseTime);
  } else {
    log(`PLAY starting - from the start`);
    seekAt(0);
    pauseTime = 0;
  }
  
  for (const sound of timeline.sounds) {
    if (sound.sec <= pauseTime) {
      if (sound.sec + sound.duration > pauseTime) {
        howls[sound.id].seek(pauseTime - sound.sec);
        howls[sound.id].play();
        log(`sound with ID ${sound.id} - name ${sound.name} will start playing from ${pauseTime - sound.sec}`);
        continue;
      }
    }
    if (sound.sec > pauseTime) {
      const timeout = setTimeout((sound) => {
        log(`sound with ID ${sound.id} - name ${sound.name} will start playing in ${Math.max(sound.sec * 1000 - pauseTime * 1000, 0)} seconds`);
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
  log('STOP called');
  for (const sound of timeline.sounds) {
    howls[sound.id].stop();
    log('stopped active sounds');
  }
  for (const timeout of timeouts) {
    clearTimeout(timeout);
    log('stopped all timeouts');
  }
  pauseTime = 0;
  playing = false;
}

export function pause() {
  log('PAUSE called')
  stop();
  pauseTime = currentPosition();
  log('paused at ' + pauseTime);
  playing = false;
}

export function seekAt(seconds) {
  log('SEEK called - moving at sec ' + seconds); 
  const savePlaying = playing; 
  if (playing) {
    stop();
    log(`we were playing; stopping all sounds`);
  }
  pauseTime = seconds;
  for (const sound of timeline.sounds) {
    if (sound.sec <= seconds) {
      if (sound.sec + sound.duration > seconds) {
        howls[sound.id].seek(seconds - sound.sec);
        log(`SEEK - moving sound ID=${sound.id} to ${seconds - sound.sec}`);
      }
    }
    if (sound.sec > seconds) {
      const timeout = setTimeout((sound) => {
        howls[sound.id].seek(0);
      }, Math.max(sound.sec * 1000 - seconds * 1000, 0), sound);
      log('setting seek timeout for file with ID ' + sound.id + ' to ' + Math.max(sound.sec * 1000 - seconds * 1000, 0));
      timeouts.push(timeout);
    }
  }
  if (savePlaying) {
    play();
    log('we were playing; resuming play')
  }
}


export function setTimerFunction(fun) {
  currentPosition = fun;
}

