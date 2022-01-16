import { FastifyInstance } from 'fastify';
import statusRoute from './routes/api/v1/status-route.js';

import { EnabledApiVersions } from './config.js';

const isVersionEnabled = (version: string) => EnabledApiVersions.includes("*") || EnabledApiVersions.includes(version);

export default function (server: FastifyInstance) {
    if (isVersionEnabled("v1")) {
        server.register(statusRoute, { prefix: "/api/v1" })
    }
}