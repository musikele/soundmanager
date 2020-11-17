export const EVENTS = {
    LOADING_COMPLETE: 'SOUNDMANAGER_LOADING_COMPLETE',
    TRACK_LOADED: 'SOUNDMANAGER_TRACK_LOADED'
}

export const dispatchCustomEvent = (event, params) => {
    const customEvent = new window.CustomEvent(event, params)
    window.top.dispatchEvent(customEvent);
} 