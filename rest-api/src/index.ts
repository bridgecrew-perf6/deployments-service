import {createServer, startListening} from './server';

// Ideally, only entrypoints will use this
import * as config from './config';
import initializeDeploymentsCountWorker from './initialize-deployments-count-worker';

async function main() {

    const server = await createServer({
        hostname: config.Host,
        port: config.Port,
        verbose: config.Verbose,
        exposeDocs: config.ExposeDocs,
        repositoryType: config.RepositoryType,
        repositoryInfo: {
            username: config.RepositoryUser,
            password: config.RepositoryPassword,
            hostname: config.RepositoryHost,
            port: config.RepositoryPort,
            schema: config.RepositorySchema
        }
    });

    initializeDeploymentsCountWorker(server, config.DeploymentsCountFilePath);

    startListening(server);
}

main()
    .catch(console.error);
