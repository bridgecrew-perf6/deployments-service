import EventEmitter from "events";

// Add more events here
export type EventType = "deployment-created";

export type EventListener = (payload: any) => void;

export default class EventBus {
    emitter: EventEmitter;

    constructor() {
        this.emitter = new EventEmitter();
    }

    emit(eventType: EventType, payload: any) {
        this.emitter.emit(eventType, payload)
    }

    addListener(eventType: EventType, eventListener: EventListener) {
        this.emitter.addListener(eventType, eventListener);
    }
}