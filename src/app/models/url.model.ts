export interface Url {
    $id?: string;
    originalUrl: string;
    shortUrl: string;
    clicks?: number;
    userId: string;
    description?: string;
}