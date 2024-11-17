import { type Models } from 'appwrite';

export interface Url extends Models.Document {
    originalUrl: string;
    shortUrl: string;
    clicks?: number;
    userId: string;
    description?: string;
}