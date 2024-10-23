import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private apiService: ApiService
  ) { }

  async setLanguage(user: User, languageId: string) {
    const data = { language: languageId };
    await this.apiService.updateDocument(environment.USERS_COLLETION, user.$id, data);
  }
}
