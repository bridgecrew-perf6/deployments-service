import process from 'process';
import {createServer, startListening} from './server';
import {RepositoryType} from './repositories/repository';

// Ideally, only entrypoints will use this
import * as config from './config';
import initializeDeploymentsCountWorker from './initialize-deployments-count-worker';

process.on('SIGINT', () => process.exit(0));

/**
 * The entry point to the application.
 * 
 * Bootstraps a server and the appropriate workers according to configuration.
 */
async function main() {
    const server = await createServer({
        hostname: config.Host,
        port: config.Port,
        verbose: config.Verbose,
        exposeDocs: config.ExposeDocs,
        repositoryType: config.RepositoryType as RepositoryType,
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
