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

describe('api/v1/status route', () => {
    it('should return valid response', async () => {
        // Arrange
        const server = createServer(serverInfo);

        // Act
        const response = await server.inject({
            method: 'GET',
            url: '/api/v1/status'
        });

        // Assert
        assert.equal(response.statusCode, 200);

        const body = response.json();
        assert.hasAllKeys(body, ['message', 'creationTime', 'repositoryType']);
    })
})