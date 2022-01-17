import { FastifyInstance } from 'fastify';
import statusRoute from './routes/api/v1/status-route';

import { EnabledApiVersions } from './config';

const isVersionEnabled = (version: string) => EnabledApiVersions.includes('*') || EnabledApiVersions.includes(version);

export default function (server: FastifyInstance) {
    if (isVersionEnabled('v1')) {
        server.register(statusRoute, { prefix: '/api/v1' })
    }
}