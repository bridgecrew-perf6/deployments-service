import path from 'path';
import fs from 'fs';
import { FastifyInstance } from "fastify";
import countFileIncrementor from "./services/count-file-incrementor";
import systemExclusiveScope from "./services/system-exclusive-scope";

function makeDirIfNotExists(filePath: string) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
}

/**
 * Bind a worker on the event bus to increment the counts file.
 * 
 * The worker is running inside a system wide exclusive scope so that there will not be
 * any race conditions with other instances of the service on the same machine.
 * 
 * Another approach, which is perhaps more robust, is to have an external service to handle
 * this which is receiving commands from a queue. Practically spooling the file.
 */
 export default function(server: FastifyInstance, filePath: string) {
    makeDirIfNotExists(filePath);
    const incrementCountFile = countFileIncrementor(filePath);
    const exclusiveScope = systemExclusiveScope("deployments-service", incrementCountFile);
    server.eventBus.addListener("deployment-created", exclusiveScope);
}