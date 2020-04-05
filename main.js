var howls = {};
var timeline = {};
const timeouts = [];
let startTime = 0;
let pauseTime = 0;
let isPaused = false;
let elapsedTimeFromStart = 0;

function onLoad(sound) {
    sound.duration = howls[sound.name].duration();
}

function setup(timeline) {
    this.timeline = timeline;
    for (sound of timeline.sounds) {
        howls[sound.name] = new Howl({
            src: [sound.name],
            preload: true,
            onload: onLoad.bind(null, sound)
        });
    }
}

function play() {
    seekAt(0);
}

function stop() {
    console.log('stop');
    startTime = 0; 
    pauseTime = 0;
    for (sound of timeline.sounds) {
        howls[sound.name].stop();
        howls[sound.name].load();
    }
    for (timeout of timeouts) {
        clearTimeout(timeout);
    }
}

function pause() {
    console.log('pause');
    pauseTime = new Date().getTime();
    isPaused = true;
    stop();
    elapsedTimeFromStart = pauseTime - startTime; 
    console.log(elapsedTimeFromStart);
}

function seekAt(seconds) {
    this.stop();
    for (sound of timeline.sounds) {
        if (sound.sec <= seconds) {
            if (sound.sec + sound.duration > seconds ) {
                console.log('starting: ', sound.name, ' from sec: ', seconds - sound.sec);
                howls[sound.name].seek(seconds - sound.sec);
                howls[sound.name].play();
            }
        }
        if(sound.sec > seconds) {
            let timeout = setTimeout((sound) => {
                console.log('starting: ', sound.name);
                howls[sound.name].seek(0);
                howls[sound.name].play();
            }, Math.max(sound.sec * 1000 - seconds * 1000, 0), sound);
            timeouts.push(timeout);
        }
    }
}