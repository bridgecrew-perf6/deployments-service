import fastify from "fastify";

import * as config from './config';
import * as docs from "./docs";
import registerRoutes from './register-routes';

const server = fastify({
    logger: config.Verbose,
});

if (config.ExposeDocs) {
    docs.registerPlugin(config.Host, server);
}


registerRoutes(server);


server.listen(config.Port, config.Host, (err, address) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    } else if (config.Verbose) {
        console.log("Server has started.", {
            ...config
        })
    }

    if (config.ExposeDocs) {
        docs.initializeOnListen(server);
    }
});