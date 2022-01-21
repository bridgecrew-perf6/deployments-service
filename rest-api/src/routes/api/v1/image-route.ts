import { FastifyInstance } from 'fastify';
import { Image } from '../../../model';
import { PaginationCriteria } from '../../../services/pagination';
import combinations from '../../../services/combinations';
import StatusCode from 'http-status-codes';

const Schema = {
    Image: {
        $id: "model/image",
        type: "object",
        required: ["id", "name", "repository", "version"],
        properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            repository: { type: 'string' },
            version: { type: 'string' },
            metadata: {
                type: "object",
                patternProperties: {
                    ".*": { type: "string" }
                }
            }
        },
    },
    ImageArray: {
        $id: "model/image-array",
        type: "array",
        items: {
            $ref: "model/image"
        }
    }
}
export default async function (
    server: FastifyInstance,
) {
    server.addSchema(Schema.Image);
    server.addSchema(Schema.ImageArray);

    server.post<{ Body: Image; Reply: Image }>('/image', {
        schema: {
            body: {
                $ref: 'model/image'
            },
            response: {
                [StatusCode.OK]: {
                    $ref: 'model/image'
                }
            }
        }
    }, async function (request, response) {
        const upserted = await this.repository.upsertImage(request.body);
        response.send(upserted);
    });

    server.get<{ Reply: Image, Params: { id: string } }>('/image/:id', {
        schema: {
            response: {
                [StatusCode.OK]: {
                    $ref: 'model/image'
                },
                [StatusCode.NOT_FOUND]: { }
            }
        }
    }, async function (request, response) {
        const image = await this.repository.getImageById(request.params.id)

        image
            ? response.send(image)
            : response.callNotFound();
    })

    server.get<{ Reply: Image[], Querystring: PaginationCriteria }>('/image', {
        schema: {
            querystring: {
                $ref: "pagination"
            },
            response: {
                [StatusCode.OK]: {
                    $ref: "model/image-array"
                }
            }
        }
    }, async function (request, response) {
        const { offset, limit } = request.query;
        const images = await this.repository.getAllImages(offset, limit);
        response.send(images);
    })

    server.get<{ Reply: string[][]; Querystring: { length: number } }>('/image/combinations', {
        schema: {
            querystring: {
                type: "object",
                required: ["length"],
                properties: {
                    length: { type: "number" }
                }
            },
            response: {
                [StatusCode.OK]: {
                    type: "array",
                    items: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                }
            }
        }
    }, async function (request, response) {
        const ids = await this.repository.getAllImageIds();
        const ans = combinations([...ids], request.query.length) as string[][]
        response.send(ans);
    })
}