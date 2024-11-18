import { type Models } from 'appwrite';

export interface Category extends Models.Document {
    name: string;
    userId: string;
}