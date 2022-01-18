import { FastifyInstance } from 'fastify';
import { RepositoryType } from '../../../repositories/repository';

const Schema = {
    Status: {
        $id: 'status',
        type: 'object',
        required: ['message'],
        properties: {
            message: { type: 'string' },
            creationTime: { type: 'string', format: 'date' },
            repositoryType: { type: 'string' }
        }
    }
}

interface StatusReply {
    message: string
    creationTime: Date
    repositoryType: RepositoryType
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
            creationTime,
            repositoryType: this.repository.getType()
        })
    });
}