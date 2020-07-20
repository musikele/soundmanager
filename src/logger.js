let debug = false; 

export function setDebug(value) {
    debug = value;
}

export function getDebug() {
    return debug;
}

export function log(text) {
    if (!debug) {
        return;
    }
    if (typeof text !== 'string') {
        console.log(text);
    } else {
        console.log('SOUNDMANAGER: ' + text);
    }
}

