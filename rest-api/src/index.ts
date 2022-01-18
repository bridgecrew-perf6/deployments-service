import {createServer, startListening} from './server';

// Ideally, only entrypoints will use this
import * as config from './config';

function main() {

    const server = createServer({
        hostname: config.Host,
        port: config.Port,
        verbose: config.Verbose,
        exposeDocs: config.ExposeDocs,
        repositoryType: config.RepositoryType,
        repositoryInfo: {
            hostname: config.RepositoryHost,
            port: config.RepositoryPort,
            schema: config.RepositorySchema
        }
    });

    startListening(server);
}

main();
