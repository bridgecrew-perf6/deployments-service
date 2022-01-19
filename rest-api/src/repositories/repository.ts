import { Deployment, Image } from "../model";
import MemoryRepository from "./memory-repository";
import MongoRepository from "./mongo-repository";

/**
 * All known repository implementations
 */
export type RepositoryType = "memory"
                           | "mongo";

/**
 * Our abstraction for what a repository needs to provide to the rest of the system.
 * 
 * It's client shouldn't be aware of the underlying implementation.
 */
export interface Repository {
    connect(): Promise<void>

    upsertImage(image: Image): Promise<Image>;
    getImageById(id: string): Promise<Image | null>;
    getAllImages(offset: number, limit: number): Promise<Image[]>;
    getAllImageIds(): Promise<Set<string>>;

    createDeployment(deployment: Deployment): Promise<void>;
    getAllDeployments(offset: number, limit: number): Promise<Deployment[]>;
    countDeployments(): Promise<number>;

    // close?
}

/**
 * Uniform information on repository initialization.
 * 
 * With better design we can have this tighter and specific to the repository types - E.g using a builder pattern.
 */
export interface RepositoryInfo {
    username: string
    password: string
    hostname: string
    port: number
    schema: string
}

// Factory for creating repositories without knowing the underlying implementation types
export function create(type: RepositoryType, info: RepositoryInfo | null): Repository {
    switch (type) {
        case "memory":
            return new MemoryRepository();
        case "mongo":
            if (info === null) {
                throw new Error("A MongoRepository must have information associated");
            }
            return new MongoRepository(info);
        default:
            throw new Error(`No known implementation for repository type: ${type}`);
    }
}
