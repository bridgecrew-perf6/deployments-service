import MemoryRepository from "./memory-repository";
import MongoRepository from "./mongo-repository";

export type RepositoryType = "memory" | "mongo";

export interface Repository {
    getType(): RepositoryType
}

export interface RepositoryInfo {
    hostname: string
    port: number
    schema: string
}

// Factory for creating repositories without knowing the underlying implementation types
export function create(type: RepositoryType, info: RepositoryInfo): Repository {
    switch (type) {
        case "memory":
            return new MemoryRepository();
        case "mongo":
            return new MongoRepository(info);
        default:
            throw new Error(`No known implementation for repository type: ${type}`);
    }
}