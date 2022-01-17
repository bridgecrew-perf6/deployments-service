import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from "fastify";

export default async function (
    server: FastifyInstance,
) {
    const creationTime = new Date();

    server.addSchema({
        $id: "status/response",
        type: "object",
        required: ["message"],
        properties: {
            message: { type: "string" },
            creationTime: { type: "string", format: "date" }
        }
    });

    server.get<{}>("/status", {
        schema: {
            response: {
                200: {
                    $ref: "status/response"
                }
            }
        }
    }, async (request, response) => {
        response.send({
            message: "Everything seems good",
            creationTime,
        })
    });
}