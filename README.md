# Soundmanager 

Soundmanager allows to play a bunch of tracks in a timed order. 

## How to use 

### install as global dependency (for now -- umd version is coming)

```
$ npm install 
$ npm run build
```

Then you can take the file in `/dist/main.js`, rename as you like, and use it directly in your code with the name SoundManager. 

You should prepare a tracklist like this one: 

```
var timeline = {
    sounds: [
        {
            sec: 0, // seconds 
            name: 'bensound-summer.mp3',
            start: 5, // starts to play from the 5th second
            length: 2 // plays only for two seconds 
        },
        {
            sec: 4,
            name: 'bensound-creativeminds.mp3'
        },


        {
            sec: 2,
            name: 'bensound-ukulele.mp3'
        },
    ]
}
```

> Important: if you use the option `start`, you **must** use also `length`. 

and pass to SoundManager: 

```
SoundManager.setup(timeline);
```

Once this is done, you can control the music via the API that is provided.

## Example? 

```
# npm i -g static-server 
# npm i 
# npm run build 
# static-server (will start a server on port 9080) 
```
then, open browser to http://localhost:9080. 

## API

### SoundManager.setup(timeline)

will set up all the internals to play music.

### SoundManager.currentPosition()

returns the position we are in the music, in seconds. 

### SoundManager.play() 

plays the music from the given pointer - if none is set, it will start from the start. 
To set the pointer check method `seek`. 

### SoundManager.stop()

stops the music and resets the pointers to the start of the timeline.

### SoundManager.pause() 

Will pause the music. The pointers will be saved at the current second. 

### SoundManager.seek(sec) 

Will move the pointers to the given second. 
You can call this method either when the music is paused or when it's playing. 



