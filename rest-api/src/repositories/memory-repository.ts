import { RepositoryType } from "./repository";

export default class MemoryRepository {
    getType(): RepositoryType {
        return "memory";
    }
}