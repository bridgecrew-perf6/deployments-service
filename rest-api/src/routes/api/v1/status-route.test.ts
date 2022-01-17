import {assert} from 'chai';
import { createServer } from '../../../server';

describe('api/v1/status route', () => {
    it("should return valid response", async () => {
        // Arrange
        const { instance } = createServer({
            hostname: 'localhost',
            port: 3000,
            exposeDocs: false,
            verbose: false,
        })

        // Act
        const response = await instance.inject({
            method: 'GET',
            url: '/api/v1/status'
        });

        // Assert
        assert.equal(response.statusCode, 200);

        const body = response.json();
        assert.hasAllKeys(body, ["message", "creationTime"]);
    })
})