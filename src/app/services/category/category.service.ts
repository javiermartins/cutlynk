import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { environment } from '../../../environments/environment';
import { ID, Query } from 'appwrite';
import { Category } from '../../models/category.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private projectsSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.projectsSubject.asObservable();
  public categoryFilter: Category | null = null

  constructor(
    private apiService: ApiService
  ) { }

  async getUserCategories(userId: string) {
    return await this.apiService.getDocuments(environment.CATEGORY_COLLETION, [Query.equal('userId', userId)]).then((categories) => {
      this.projectsSubject.next(categories.documents as Category[]);
    }).catch((error: Error) => {
      console.error(error);
    });
  }

  async newCategory(category: Category) {
    await this.apiService.createDocument(environment.CATEGORY_COLLETION, ID.unique(), category);
  }

  async updateCategory(categoryId: string, categoryData: any) {
    return await this.apiService.updateDocument(environment.CATEGORY_COLLETION, categoryId, categoryData);
  }

  async deleteCategory(categoryId: string) {
    return await this.apiService.deleteDocument(environment.CATEGORY_COLLETION, categoryId);
  }

}
