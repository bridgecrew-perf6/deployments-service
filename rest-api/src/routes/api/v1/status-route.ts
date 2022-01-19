import { FastifyInstance } from 'fastify';

const Schema = {
    Status: {
        $id: 'status',
        type: 'object',
        required: ['message'],
        properties: {
            message: { type: 'string' },
            creationTime: { type: 'string', format: 'date' },
        }
    }
}

interface StatusReply {
    message: string
    creationTime: Date
}

export default async function (
    server: FastifyInstance,
) {
    const creationTime = new Date();

    server.addSchema(Schema.Status);

    server.get<{ Reply: StatusReply }>('/status', {
        schema: {
            response: {
                200: {
                    $ref: 'status'
                }
            }
        }
    }, async function (_request, response) {
        response.send({
            message: 'Everything seems good',
            creationTime
        })
    });
}
