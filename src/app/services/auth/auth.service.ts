import { Injectable } from '@angular/core';
import { account } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { environment } from "../../../environments/environment";
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiService: ApiService
  ) { }

  async isAuthenticated() {
    try {
      await this.getUser();
      return true;
    } catch (error) {
      return false;
    }
  }

  async getUser() {
    return await account.get();
  }

  async checkAndCreateUser() {
    const user: any = await account.get();
    try {
      const response = await this.apiService.getDocuments(environment.USERS_COLLETION, [Query.equal('$id', user.$id)]);
      if (response.documents.length === 0) {
        const data = {
          name: user.name,
          email: user.email
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
