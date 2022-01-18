import { Image, Deployment } from "../model";
import { Repository, RepositoryType } from "./repository";

export interface MongoConnectionParameters {
    hostname: string
    port: number
    schema: string
}

export default class MongoRepository implements Repository {

    constructor({ hostname, port, schema }: MongoConnectionParameters) {

    }

    getType(): RepositoryType {
        return "mongo";
    }

    getAllImageIds(): Promise<Set<string>> {
        throw new Error("Method not implemented.");
    }

    upsertImage(image: Image): Promise<Image> {
        throw new Error("Method not implemented.");
    }

    getImageById(id: string): Promise<Image | null> {
        throw new Error("Method not implemented.");
    }

    getAllImages(offset: number, limit: number): Promise<Image[]> {
        throw new Error("Method not implemented.");
    }

    createDeployment(deployment: Deployment): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getAllDeployments(offset: number, limit: number): Promise<Deployment[]> {
        throw new Error("Method not implemented.");
    }

    countDeployments(): Promise<number> {
        throw new Error("Method not implemented.");
    }
}