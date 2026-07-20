import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import config from 'config';
import type { FileData, FileStorage } from '../types/storage.js';

export class S3Storage implements FileStorage {
    private client: S3Client;

    constructor() {
        this.client = new S3Client({
            region: config.get('s3.region'),
            credentials: {
                accessKeyId: config.get('s3.accessKeyId'),
                secretAccessKey: config.get('s3.secretAccessKey'),
            },
        });
    }

    async upload(data: FileData): Promise<void> {
        const objectParams = {
            Bucket: config.get('s3.bucket') as string,
            Key: data.filename,
            Body: data.fileData,
        };

        await this.client.send(new PutObjectCommand(objectParams));
    }

    async delete(filename: string): Promise<void> {
        const objectParams = {
            Bucket: config.get('s3.bucket') as string,
            Key: filename,
        };

        await this.client.send(new DeleteObjectCommand(objectParams));
    }

    getObjectUri(): string {
        throw new Error('Method not implemented.');
    }
}
