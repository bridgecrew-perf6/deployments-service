import { RepositoryType } from "./repository";

export interface MongoConnectionParameters {
    hostname: string
    port: number
    schema: string
}

export default class MongoRepository {

    constructor({hostname, port, schema}: MongoConnectionParameters) {

    }

    getType(): RepositoryType {
        return "mongo";
    }
}