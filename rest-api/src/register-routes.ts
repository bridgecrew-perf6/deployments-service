import { FastifyInstance } from 'fastify';

import { Schema as PaginationSchema } from './services/pagination';
import { Schema as GenericPayloadsSchema } from './services/generic-payloads';

import statusRoute from './routes/api/v1/status-route';
import imageRoute from './routes/api/v1/image-route';

import { EnabledApiVersions } from './config';
import deploymentRoute from './routes/api/v1/deployment-route';

const isVersionEnabled = (version: string) => EnabledApiVersions.includes('*') || EnabledApiVersions.includes(version);

export default function (server: FastifyInstance) {
    // This is a bit ugly, but it's the only reasonable place i could think of placing
    // the global schemas.
    server.addSchema(PaginationSchema);
    server.addSchema(GenericPayloadsSchema.BadRequest)

    if (isVersionEnabled('v1')) {
        server.register(statusRoute, { prefix: '/api/v1' })
        server.register(imageRoute, { prefix: '/api/v1/' })
        server.register(deploymentRoute, { prefix: '/api/v1/' })
    }
}