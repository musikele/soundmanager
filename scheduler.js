class Scheduler {

    time = 0;
    interval = null;
    pauseTime = 0;
    started = false; 
    paused = false;
    startTime = 0;
    pausedTime = 0;
    seekTime = 0;

    constructor() {}

    start(callback) {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.startTime = new Date().getTime() - (this.pausedTime * 1000);
        this.interval = setInterval(() => {
            if (typeof this.seekTime !== 'undefined') {
                this.startTime = new Date().getTime() - this.seekTime * 1000;
            }
            this.time = new Date().getTime() - this.startTime;
            this.seekTime = undefined;
        }, 50);
        this.pausedTime = 0;
        if (callback) callback();
    }

    stop(callback) {
        this.time = 0;
        this.pauseTime = 0; 
        this.started = false; 
        this.paused = false; 
        clearInterval(this.interval);
        if (callback) callback();
    }

    pause(callback) {
        this.paused = true;
        this.pausedTime = this.currentPosition();
        console.log('paused at: ', this.pausedTime);
        clearInterval(this.interval);
        if (callback) callback();
    }

    currentPosition() {
        return this.time / 1000;
    }

    seek(seconds, callback) {
        this.seekTime = this.currentPosition();
        this.seekTime += seconds; 
        if (this.seekTime < 0) this.seekTime = 0;
        this.time = this.seekTime * 1000;
        console.log('seek to: ', this.seekTime);
        if (callback) callback();
    }
}