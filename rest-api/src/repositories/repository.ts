import { Deployment, Image } from "../model";
import MemoryRepository from "./memory-repository";
import MongoRepository from "./mongo-repository";

export type RepositoryType = "memory" | "mongo";

export interface Repository {
    connect(): Promise<void>

    upsertImage(image: Image): Promise<Image>;
    getImageById(id: string): Promise<Image | null>;
    getAllImages(offset: number, limit: number): Promise<Image[]>;
    getAllImageIds(): Promise<Set<string>>;

    createDeployment(deployment: Deployment): Promise<void>;
    getAllDeployments(offset: number, limit: number): Promise<Deployment[]>;
    countDeployments(): Promise<number>;
}

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
