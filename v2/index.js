const { Machine, interpret } = require('xstate');

const unloaded = {
    on: {
        LOAD: 'stopped'
    }
}

const stopped = {
    entry: ['stopAction'],
    on: {
        PLAY: 'playing'
    }
}
const playing = {
    entry: ['playAction'],
    exit: undefined,
    on: {
        STOP: 'stopped',
        PAUSE: 'paused',
        SEEK: {
            actions: ['seekAction']
        }
    }
}
const paused = {
    entry: ['pausedAction'],
    on: {
        STOP: 'stopped',
        PLAY: 'playing',
    }
}

const states = {unloaded, stopped, playing, paused}

const initial = 'unloaded'

const config = {
    id: 'soundManager',
    initial,
    context: {
        time: 0,
        interval: null, 
        startTime: 0,
        pausedTime: 0,
        seekTime: 0
    },
    states
}

const soundManagerMachine = Machine(config, {
    actions: {
        playAction: (context, event) => { 
            if (context.interval) {
                clearInterval(context.interval);
              }
              context.startTime = new Date().getTime() - (context.pausedTime * 1000);
              context.interval = setInterval(() => {
                if (typeof context.seekTime !== 'undefined') {
                    context.startTime = new Date().getTime() - context.seekTime * 1000;
                }
                context.time = new Date().getTime() - context.startTime;
                context.seekTime = undefined;
              }, 50);
              context.pausedTime = 0;
              console.log(context)
        },
        stopAction: (context, event) => { 
            context.time = 0;
            context.pausedTime = 0;
            clearInterval(context.interval);
            console.log(context)
        },
        pausedAction: (context, event) => { 
            context.pausedTime = context.time / 1000;
            clearInterval(context.interval);
            console.log(context)
        },
        seekAction: (context, event) => {
            context.seekTime = event.seconds
            if (context.seekTime < 0) context.seekTime = 0
            context.time = console.seekTime * 1000 
        }
    }
})

const service = interpret(
    soundManagerMachine
).start()

service.onTransition(state => {
    console.log(state.value)
})

service.send('LOAD')
service.send('PLAY')
service.send('PAUSE')
service.send('PLAY')
service.send('STOP')
service.send('PAUSE')

