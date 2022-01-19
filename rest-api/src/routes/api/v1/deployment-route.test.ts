import { assert } from 'chai';
import { createServer, ServerInfo } from '../../../server';

const serverInfo: ServerInfo = {
    hostname: 'localhost',
    port: 3000,
    exposeDocs: false,
    verbose: false,
    repositoryType: "memory",
    repositoryInfo: null
}

describe('api/v1/deployment route', () => {
    it('create deployment for not existing image should fail with 400', async () => {
        // Arrange
        const server = await createServer(serverInfo);

        // Act
        let response = await server.inject({
            method: 'PUT',
            url: '/api/v1/deployment',
            payload: {
                imageId: "some id that does not exist"
            }
        });

        // Assert
        assert.equal(response.statusCode, 404);
        assert.deepEqual(response.json(), {
            message: `No such image with id "some id that does not exist"`
        })
    })

    it('create multiple deployments for an existing image should all succeeed with 204', async () => {
        // Arrange
        const server = await createServer(serverInfo);
        server.repository.upsertImage({
            id: "specific-id",
            version: "some version",
            name: "some name",
            repository: "some repository"
        })

        // Act
        const responses = await Promise.all([...Array(10)].map(() => server.inject({
            method: 'PUT',
            url: '/api/v1/deployment',
            payload: {
                imageId: 'specific-id'
            }
        })));

        // Assert
        assert.equal(responses.length, 10);
        for (const response of responses) {
            assert.equal(response.statusCode, 204);
        }

        // assert that the repository actually contains 10 deployments with imageId of "specific id"
        assert.deepEqual(
            (await server.repository.getAllDeployments(0, 10)).map(deployment => deployment.imageId),
            [...Array(10)].map(() => "specific-id"));
    })

    it("count action should return 0 before any deployments have been created", async () => {
        // Arrange
        const server = await createServer(serverInfo);

        // Act
        const response = await server.inject({
            method: 'GET',
            url: '/api/v1/deployment/count',
        })

        // Assert
        assert.equal(response.statusCode, 200);
        assert.deepEqual(response.json(), {
            count: 0
        })
    })

    it("count action should return 0 before any deployments have been created", async () => {
        // Arrange
        const server = await createServer(serverInfo);

        for (let idx = 0; idx < 10; ++idx) {
            await server.repository.createDeployment({
                imageId: "some id"
            });
        }

        // Act
        const response = await server.inject({
            method: 'GET',
            url: '/api/v1/deployment/count',
        })

        // Assert
        assert.equal(response.statusCode, 200);
        assert.deepEqual(response.json(), {
            count: 10
        })
    })

    it('should get correct page of deployments', async () => {
        // Arrange
        const server = await createServer(serverInfo);

        let deployments = [...Array(10)].map((_, index) => ({
            imageId: `${index}`,
        }));

        await Promise.all(deployments.map(deployment => server.repository.createDeployment(deployment)));

        // Act
        const response = await server.inject({
            method: "GET",
            url: '/api/v1/deployment?offset=3&limit=4',
        })

        // Assert
        assert.equal(response.statusCode, 200);

        const expectedPage = deployments.filter((_, index) => index >= 3 && index < 7);
        const actualPage = response.json();
        assert.deepEqual(actualPage, expectedPage);
    })
})
