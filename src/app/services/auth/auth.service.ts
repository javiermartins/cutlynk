import { Injectable } from '@angular/core';
import { account } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { environment } from "../../../environments/environment";
import { ApiService } from '../api/api.service';
import { TranslateService } from '@ngx-translate/core';
import languages from '../../data/languages';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiService: ApiService,
    private translateService: TranslateService
  ) { }

  async isAuthenticated() {
    return await this.getUser().then(() => {
      return true;
    }).catch(() => {
      return false;
    });
  }

  async getUser(): Promise<User> {
    const user = await account.get();
    return await this.apiService.getDocument(environment.USERS_COLLETION, user.$id).then((user) => { return user as User });
  }

  async checkAndCreateUser() {
    const user = await account.get();
    const browserLang = this.translateService.getBrowserLang();
    const languageExist = languages.find((lang) => lang.id === browserLang)

    try {
      const response = await this.apiService.getDocuments(environment.USERS_COLLETION, [Query.equal('$id', user.$id)]);
      if (response.documents.length === 0) {
        const data = {
          name: user.name,
          email: user.email,
          language: languageExist ? languageExist.id : this.translateService.getDefaultLang()
        }

        await this.apiService.createDocument(environment.USERS_COLLETION, user.$id, data);
      }
    } catch (error) {
      console.error('Error when verifying or creating the user: ', error);
    }
  }

  async logout() {
    await account.deleteSession('current');
  }
}
