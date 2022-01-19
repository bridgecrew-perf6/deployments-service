import { FastifyInstance } from "fastify/types/instance";
import { RepositoryType, RepositoryInfo, Repository } from "./repositories/repository";

import { create as createRepository } from './repositories/repository';

declare module 'fastify' {
    interface FastifyInstance {
        repository: Repository
    }
}

export default async function (
    server: FastifyInstance,
    repositoryType: RepositoryType,
    repositoryInfo: RepositoryInfo | null
) {
    const repository = createRepository(repositoryType, repositoryInfo);
    await repository.connect();
    server.decorate("repository", repository);
}
