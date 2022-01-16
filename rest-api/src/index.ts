import fastify from "fastify";

import * as config from './config';
import * as docsEndpoint from "./docs-endpoint";
import registerRoutes from './register-routes';

const server = fastify({
    logger: config.Verbose,
});

if (config.ExposeDocs) {
    docsEndpoint.registerPlugin(config.Host, server);
}

registerRoutes(server);

server.listen(config.Port, config.Host, (err, address) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    
    if (config.Verbose) {
        console.log(`Server is listening on address ${address}.`, config);
    }

    if (config.ExposeDocs) {
        docsEndpoint.initializeOnListen(server);
    }
});