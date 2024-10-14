import { Injectable } from '@angular/core';
import { ID, Query } from 'appwrite';
import { environment } from '../../../environments/environment';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor(
    private apiService: ApiService
  ) { }

  async createShortenedUrl(urlData: any) {
    await this.apiService.createDocument(environment.URL_COLLETION, ID.unique(), urlData);
  }

  async getUserUrls(userId: string) {
    return await this.apiService.getDocuments(environment.URL_COLLETION, [Query.equal('userId', userId)]);
  }

  async getUrlByShortUrl(shortUrl: string) {
    return await this.apiService.getDocuments(environment.URL_COLLETION, [Query.equal('shortUrl', shortUrl)]);
  }

  async deleteUrl(urlId: string) {
    return await this.apiService.deleteDocument(environment.URL_COLLETION, urlId);
  }

}
