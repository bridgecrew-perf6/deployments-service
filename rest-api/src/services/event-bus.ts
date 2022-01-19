import EventEmitter from "events";

// Add more events here
export type EventType = "deployment-created";

export type EventListener = (payload: any) => void;

/**
 * Provides a typed event bus.
 */
export default class EventBus {
    emitter: EventEmitter;

    constructor() {
        this.emitter = new EventEmitter();
    }

    /**
     * Emit an event and invoke all correlated listeners
     */
    emit(eventType: EventType, payload: any) {
        this.emitter.emit(eventType, payload)
    }

    /**
     * Register a new listener for a specified event type
     */
    addListener(eventType: EventType, eventListener: EventListener) {
        this.emitter.addListener(eventType, eventListener);
    }
}