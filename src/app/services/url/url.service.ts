import { Injectable } from '@angular/core';
import { ID, Query } from 'appwrite';
import { environment } from '../../../environments/environment';
import { ApiService } from '../api/api.service';
import { Url } from '../../models/url.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  private urlSubject = new BehaviorSubject<Url[]>([]);
  public urls$ = this.urlSubject.asObservable();

  constructor(
    private apiService: ApiService
  ) { }

  async createShortenedUrl(urlData: Url) {
    await this.apiService.createDocument(environment.URL_COLLETION, ID.unique(), urlData);
  }

  async getUserUrls(userId: string, categoryId?: string) {
    const queries = [Query.equal('userId', userId)];

    if (categoryId) {
      queries.push(Query.equal('categoryId', categoryId));
    }

    return await this.apiService.getDocuments(environment.URL_COLLETION, queries).then((categories) => {
      this.urlSubject.next(categories.documents as Url[]);
    }).catch((error: Error) => {
      console.error(error);
    });;
  }

  async updateUrl(idUrl: string, urlData: any) {
    return await this.apiService.updateDocument(environment.URL_COLLETION, idUrl, urlData);
  }

  async getUrlByShortUrl(shortUrl: string) {
    return await this.apiService.getDocuments(environment.URL_COLLETION, [Query.equal('shortUrl', shortUrl)]);
  }

  async deleteUrl(urlId: string) {
    return await this.apiService.deleteDocument(environment.URL_COLLETION, urlId);
  }

}
