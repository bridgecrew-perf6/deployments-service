import mongoose from "mongoose";
import { Image, Deployment } from "../model";
import { Repository } from "./repository";

export interface MongoConnectionParameters {
    username: string
    password: string
    hostname: string
    port: number
    schema: string
}

interface WithTimeAudit {
    lastUpdateTime: Date
}

type ImageEntity = WithTimeAudit & Image;
type DeploymentEntity = WithTimeAudit & Deployment;

const ImageSchema = new mongoose.Schema<ImageEntity>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    repository: { type: String, required: true, unique: true },
    version: { type: String, required: true, unique: false },
    metadata: {},
    lastUpdateTime: { type: Date, reuqired: true }
});

const DeploymentSchema = new mongoose.Schema<DeploymentEntity>({
    imageId: { type: String, required: false, unique: false },
    lastUpdateTime: { type: Date, reuqired: true }
});

const ImageModel = mongoose.model<ImageEntity>("Image", ImageSchema);
const DeploymentModel = mongoose.model<DeploymentEntity>("Deployment", DeploymentSchema);

export default class MongoRepository implements Repository {

    connectionParameters: MongoConnectionParameters

    constructor(connectionParameters: MongoConnectionParameters) {
        this.connectionParameters = connectionParameters
    }
    
    async connect(): Promise<void> {
        const {hostname, port, username, password, schema} = this.connectionParameters;

        await mongoose.connect(`mongodb://${hostname}:${port}/${schema}`, {
            authSource: "admin",
            auth: { username, password }
        });
    }

    async getAllImageIds(): Promise<Set<string>> {
        const result = await ImageModel
            .find()
            .select("id");
        return new Set(result.map(({ id }) => id));
    }

    async upsertImage(image: Image): Promise<Image> {
        const entity = {
            ...image,
            lastUpdateTime: new Date()
        };

        // TODO: This is prone to rece condition bugs - Im sure there is a better way
        const existing = await this.getImageById(image.id);
        if (existing) {
            entity.metadata = Object.assign(existing.metadata || {}, entity.metadata || {});
        }

        await ImageModel.findOneAndUpdate({id: image.id}, entity, { upsert: true,  });

        return entity;
    }

    async getImageById(id: string): Promise<Image | null> {
        return await ImageModel.findOne({ id });
    }

    async getAllImages(offset: number, limit: number): Promise<Image[]> {
        return await ImageModel.find()
            .sort("lastUpdateTime")
            .skip(offset).limit(limit);
    }

    async createDeployment(deployment: Deployment): Promise<void> {
        const entity = {
            ...deployment,
            lastUpdateTime: new Date()
        };

        await DeploymentModel.create(entity);
    }

    async getAllDeployments(offset: number, limit: number): Promise<Deployment[]> {
        return await DeploymentModel.find()
            .sort("lastUpdateTime")
            .skip(offset).limit(limit);
    }

    async countDeployments(): Promise<number> {
        return await DeploymentModel.count();
    }
}
