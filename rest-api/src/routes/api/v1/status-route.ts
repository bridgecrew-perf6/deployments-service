import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from "fastify";

export default async function(
    server: FastifyInstance,
    options: FastifyPluginOptions,
) {
    const creationTime = new Date();

    server.get<{}>('/status', async (request, response) => {
        response.send({
            message: "Everything seems good",
            creationTime,
        })
    });
}