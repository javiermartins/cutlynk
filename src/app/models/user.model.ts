import { type Models } from 'appwrite';

export interface User extends Models.Document {
    name: string;
    email: string;
    language?: string;
}