import { FastifyInstance } from 'fastify';
import { EventEmitter } from 'stream';
import EventBus from './services/event-bus';

declare module 'fastify' {
    interface FastifyInstance {
        eventBus: EventEmitter
    }
}

export default function (server: FastifyInstance) {
    server.decorate("eventBus", new EventBus());
}