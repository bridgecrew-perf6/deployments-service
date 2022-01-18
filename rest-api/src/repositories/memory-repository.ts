import { v4 as uuid } from 'uuid';
import { Image, Deployment } from "../model";
import { paginator } from '../pagination';
import { Repository, RepositoryType } from "./repository";

interface StoredEntity {
    lastUpdateTime: number
}

const entitySorter = (a: StoredEntity, b: StoredEntity) => a.lastUpdateTime - b.lastUpdateTime;

const nowTime = () => new Date().getTime();

/**
 * A very simplistic, in memory repository.
 * 
 * Not for any kind of production usage, testing only.
 */
export default class MemoryRepository implements Repository {

    images: {
        [key: string]: StoredEntity & Image
    }

    deployments: (StoredEntity & Deployment)[]

    constructor() {
        this.images = {};
        this.deployments = [];
    }

    getType(): RepositoryType {
        return "memory";
    }

    getAllImageIds(): Promise<Set<string>> {
        return Promise.resolve(new Set(Object.keys(this.images)));
    }

    upsertImage(image: Image): Promise<Image> {

        if (image.id === "") {
            image = {
                ...image,
                id: uuid()
            };
        }

        const existing = this.images[image.id];
        if (!existing) {
            this.images[image.id] = {
                ...image,
                lastUpdateTime: nowTime()
            };
        } else {
            this.images[image.id] = {
                ...existing,
                ...image,
                lastUpdateTime: nowTime(),
                metadata: {
                    ...existing.metadata,
                    ...image.metadata
                }
            }
        }

        return Promise.resolve(this.images[image.id]);
    }

    getImageById(id: string): Promise<Image | null> {
        return Promise.resolve(this.images[id]);
    }

    getAllImages(offset: number, limit: number): Promise<Image[]> {
        const page = paginator(Object.values(this.images), entitySorter)(offset, limit);
        return Promise.resolve(page);
    }

    createDeployment(deployment: Deployment): Promise<void> {
        this.deployments.push({
            ...deployment,
            lastUpdateTime: nowTime(),
        });

        return Promise.resolve();
    }

    getAllDeployments(offset: number, limit: number): Promise<Deployment[]> {
        const page = paginator(this.deployments, entitySorter)(offset, limit);
        return Promise.resolve(page);
    }

    countDeployments(): Promise<number> {
        return Promise.resolve(this.deployments.length);
    }
}