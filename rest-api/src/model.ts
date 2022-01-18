/**
 * System's model.
 * 
 * For now, it is small enough for this single file.
 * On a bigger system, we might prefer to separate.
 */

export interface ImageMetadata {
    [key: string]: any
}

export interface Image {
    id: string
    name: string
    repository: string
    version: string
    metadata?: ImageMetadata
}

export interface Deployment {
    imageId: string | null
}