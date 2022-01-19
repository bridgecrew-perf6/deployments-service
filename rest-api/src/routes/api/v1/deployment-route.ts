import { FastifyInstance } from 'fastify';
import { Deployment } from '../../../model';
import { PaginationCriteria } from '../../../services/pagination';
import { BadRequestReply, NoContentReply } from '../../../services/generic-payloads';
import StatusCode from 'http-status-codes';

const Schema = {
    Deployment: {
        $id: "model/deployment",
        type: "object",
        required: [],
        properties: {
            imageId: { type: 'string' },
        },
    },
    DeploymentArray: {
        $id: "model/deployment-array",
        type: "array",
        items: {
            $ref: "model/deployment"
        }
    }
}

interface CreateDeploymentBody {
    imageId: string
}

interface DeploymentCountReply {
    count: number
}

export default async function (
    server: FastifyInstance,
) {
    server.addSchema(Schema.Deployment);
    server.addSchema(Schema.DeploymentArray);

    server.put<{
        Body: CreateDeploymentBody;
        Reply: NoContentReply | BadRequestReply
    }>('/deployment', {
        schema: {
            body: {
                $ref: 'model/deployment'
            },
            response: {
                [StatusCode.NO_CONTENT]: {
                    
                },
                [StatusCode.NOT_FOUND]: {
                    $ref: "bad-request"
                }
            }
        }
    }, async function (request, response) {
        const {imageId} = request.body;
        const image = await this.repository.getImageById(imageId);
        if (image) {
            await this.repository.createDeployment(request.body);
            this.eventBus.emit("deployment-created");
            response.status(StatusCode.NO_CONTENT);
        } else {
            response.status(StatusCode.NOT_FOUND);
            response.send({ message: `No such image with id "${imageId}"` });
        }
    });

    server.get<{
        Reply: Deployment[],
        Querystring: PaginationCriteria
    }>('/deployment', {
        schema: {
            querystring: {
                $ref: "pagination"
            },
            response: {
                [StatusCode.OK]: {
                    $ref: "model/deployment-array"
                }
            }
        }
    }, async function (request, response) {
        const { offset, limit } = request.query;
        const deployments = await this.repository.getAllDeployments(offset, limit);
        response.send(deployments);
    })

    // Usually I don't believe returning a primitive is good since we cannot
    // enhance the response later on without breaking clients.
    // So, we will wrap the primitive in an object with a single field "count"
    server.get<{ Reply: DeploymentCountReply }>('/deployment/count', {
        schema: {
            response: {
                [StatusCode.OK]: {
                    type: "object",
                    properties: {
                        count: {type: "number"}
                    }
                }
            }
        }
    }, async function (_request, response) {
        const count = await this.repository.countDeployments();
        response.send({ count });
    })
}