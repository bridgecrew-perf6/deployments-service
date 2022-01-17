import fastify, { FastifyInstance } from "fastify";

import * as docsEndpoint from './docs-endpoint';
import registerRoutes from "./register-routes";

export interface ServerInfo {
    // Indiciates wether the server should provide extra information (For now, only in the for of logging)
    verbose: boolean
    port: number
    hostname: string
    exposeDocs: boolean
}

export interface Server {
    info: ServerInfo
    instance: FastifyInstance
}

/**
 * Create a new FastifyInstance
 */
export function createServer(info: ServerInfo): Server {

    const {
        verbose,
        exposeDocs,
        hostname
    } = info;

    const instance = fastify({
        logger: verbose
    });

    if (exposeDocs) {
        docsEndpoint.register(hostname, instance);
    }

    registerRoutes(instance)

    return {
        instance,
        info
    };
}

export function startListening(server: Server) {

    const {instance, info} = server;
    const {port, hostname, verbose, exposeDocs} = info;

    instance.listen(port, hostname, (err, address) => {
        if (err) {
            instance.log.error(err);
            process.exit(1);
        }

        if (verbose) {
            console.log(`Server is listening on address ${address}.`, info);
        }

        if (exposeDocs) {
            docsEndpoint.initializeOnListen(instance);
        }
    });
}