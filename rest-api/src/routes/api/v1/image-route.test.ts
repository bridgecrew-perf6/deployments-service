import { assert } from 'chai';
import { createServer, ServerInfo } from '../../../server';

const serverInfo: ServerInfo = {
    hostname: 'localhost',
    port: 3000,
    exposeDocs: false,
    verbose: false,
    repositoryType: "memory",
    repositoryInfo: {
        hostname: "n/a",
        port: 0,
        schema: "n/a"
    }
}

describe('api/v1/image route', () => {
    it('should insert new image', async () => {
        // Arrange
        const server = createServer(serverInfo);

        const image = {
            id: "some id",
            name: "some name",
            repository: "some repository",
            version: "some version",
            metadata: {
                someProp: "some value"
            }
        }

        // Act
        let response = await server.inject({
            method: 'POST',
            url: '/api/v1/image',
            payload: image
        });

        // Assert
        assert.equal(response.statusCode, 200);
        const newImage = response.json();
        assert.deepEqual(newImage, image);
    })

    it('should get existing image by id', async () => {
        // Arrange
        const server = createServer(serverInfo);
        
        const image = {
            id: "specific id",
            name: "some name",
            repository: "some repository",
            version: "some version",
            metadata: {
                someProp: "some value"
            }
        }

        await server.repository.upsertImage(image);

        // Act
        const response = await server.inject({
            method: "GET",
            url: '/api/v1/image/specific id',
        })

        // Assert
        assert.equal(response.statusCode, 200);
        const imageGotten = response.json();
        assert.deepEqual(imageGotten, image);
    })

    it('should get correct page of images', async () => {
        // Arrange
        const server = createServer(serverInfo);

        let images = [...Array(10)].map((_, index) => ({
            id: `${index}`,
            name: "some name",
            repository: "some repository",
            version: "some version",
            metadata: {
                someProp: "some value"
            }
        }));

        await Promise.all(images.map(image => server.repository.upsertImage(image)));

        // Act
        const response = await server.inject({
            method: "GET",
            url: '/api/v1/image?offset=3&limit=4',
        })

        // Assert
        assert.equal(response.statusCode, 200);

        const expectedPage = images.filter((_, index) => index >= 3 && index < 7);
        const actualPage = response.json();
        assert.deepEqual(actualPage, expectedPage);
    })

    it('should get correct combinations of 2', async () => {
        // Arrange
        const server = createServer(serverInfo);

        let images = [...Array(3)].map((_, index) => ({
            id: `${index}`,
            name: "some name",
            repository: "some repository",
            version: "some version",
            metadata: {
                someProp: "some value"
            }
        }));

        await Promise.all(images.map(image => server.repository.upsertImage(image)));

        // Act
        const response = await server.inject({
            method: "GET",
            url: '/api/v1/image/combinations?length=2',
        })

        // Assert
        assert.equal(response.statusCode, 200);

        const expectedCombinations = [
            ["0", "1"],
            ["0", "2"],
            ["1", "2"]
        ];

        const actualCombinations = response.json();
        assert.deepEqual(actualCombinations, expectedCombinations);
    })
})