import fastify, { FastifyInstance } from 'fastify';

import * as docsEndpoint from './docs-endpoint';
import registerEventBus from './register-event-bus';

import registerRepository from './register-repository';
import registerRoutes from './register-routes';
import { RepositoryInfo, RepositoryType } from './repositories/repository';

declare module 'fastify' {
    interface FastifyInstance {
        info: ServerInfo
    }
}

/**
 * Models the information regarding how should a server be constructed
 */
export interface ServerInfo {
    verbose: boolean
    port: number
    hostname: string
    exposeDocs: boolean
    repositoryType: RepositoryType
    repositoryInfo: RepositoryInfo | null
}

/**
 * Create a new FastifyInstance
 */
export async function createServer(info: ServerInfo): Promise<FastifyInstance> {

    const {
        verbose,
        exposeDocs,
        hostname,
        repositoryType,
        repositoryInfo,
    } = info;

    const server = fastify({
        logger: verbose,
    });

    server.decorate("info", info);

    if (exposeDocs) {
        docsEndpoint.register(hostname, server);
    }

    registerEventBus(server);
    await registerRepository(server, repositoryType, repositoryInfo)
    registerRoutes(server)

    return server;
}

export function startListening(server: FastifyInstance) {

    const { port, hostname, verbose, exposeDocs } = server.info;

    server.listen(port, hostname, (err, address) => {
        if (err) {
            server.log.error(err);
            process.exit(1);
        }

        if (verbose) {
            console.log(`Server is listening on address ${address}.`, {
                ...server.info,
                repositoryInfo: {
                    ...server.info.repositoryInfo,
                    password: "********"
                }
            });
        }

        if (exposeDocs) {
            docsEndpoint.initializeOnListen(server);
        }
    });
}
