import { FastifyInstance } from "fastify/types/instance";
import { RepositoryType, RepositoryInfo, Repository } from "./repositories/repository";

import { create as createRepository } from './repositories/repository';

declare module 'fastify' {
    interface FastifyInstance {
        repository: Repository
    }
}

export default function (server: FastifyInstance, repositoryType: RepositoryType, repositoryInfo: RepositoryInfo) {
    const repository = createRepository(repositoryType, repositoryInfo);
    server.decorate("repository", repository);
}