import { FastifyInstance } from 'fastify';
import fastifySwagger from 'fastify-swagger';

/**
 * Register the documentation endpoint onto a fastify server
 */
export function register(hostname: string, server: FastifyInstance) {
    server.register(fastifySwagger, {
        routePrefix: "/docs",
        swagger: {
            info: {
                title: 'Deployments API',
                description: 'Restful API providing resource deployments resource management',
                version: '0.0.0'
            },
            host: hostname,
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json'],
            // tags
            // definitions
        },
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false
        },
        exposeRoute: true
    });
}

/**
 * Invoke when the server has booted to initialize the docs endpoint.
 * 
 * Practically, the underlying implementation is supported by swagger,
 * but this decoupling allows us to internally switch or add docs implementation.
 * 
 * @param server instance to apply docs endpoint to
 */
export function initializeOnListen(server: FastifyInstance) {
    server.swagger();
}
