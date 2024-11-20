import { Component, inject, INJECTOR, OnDestroy } from '@angular/core';
import { TuiButton, TuiDialogContext, TuiDialogOptions, TuiDialogService, TuiHintDirective, TuiIcon } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/legacy';
import { CategoryDetailComponent } from '../category-detail/category-detail.component';
import { injectContext, PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../models/user.model';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category.model';
import { CommonModule } from '@angular/common';
import { UrlService } from '../../services/url/url.service';
import { Url } from '../../models/url.model';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';


export class Props {
  user: User;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, TuiButton, TuiInputModule, TuiIcon, TranslateModule, TuiHintDirective],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  protected readonly context =
    injectContext<TuiDialogContext<void, Props>>();
  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(INJECTOR);
  public categories: Category[];

  constructor(
    public categoryService: CategoryService,
    private urlService: UrlService
  ) {
    this.getUserCategories();
  }

  async getUserCategories() {
    this.categoryService.categories$.subscribe((categories) => {
      this.categories = categories;
    });
  }

  selectCategory(category?: Category) {
    this.categoryService.categoryFilter = category;
  }

  cleanCategoryFilter() {
    this.categoryService.categoryFilter = null;
  }

  openCategoryDetail(event?: Event, category?: Category) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    const dialogOptions: Partial<TuiDialogOptions<any>> = {
      closeable: false,
      dismissible: true,
      data: {
        user: this.context.data.user,
        category: category
      }
    }

    this.dialogs
      .open(new PolymorpheusComponent(CategoryDetailComponent, this.injector), dialogOptions)
      .subscribe({
        next: async (value: any) => {
          if (value) {
            this.categoryService.getUserCategories(this.context.data.user.$id);
          }
        }
      });
  }

  async confirmDeleteCategory(event: any, category: Category) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    const dialogOptions: Partial<TuiDialogOptions<any>> = {
      closeable: false,
      dismissible: true,
      data: {
        header: 'CATEGORY.CONFIRMDELETETITLE',
        description: 'CATEGORY.CONFIRMDELETEDESCRIPTION'
      }
    }

    this.dialogs
      .open(new PolymorpheusComponent(ConfirmDeleteComponent, this.injector), dialogOptions)
      .subscribe({
        next: async (value: any) => {
          if (value) {
            this.deleteCategoryIdOfUrls(category);
          }
        },
      });
  }

  async deleteCategoryIdOfUrls(category: Category) {
    await this.urlService.urls$.subscribe(async (urls) => {
      await urls.forEach(async (url) => {
        const data: Url = { categoryId: null } as Url;
        await this.urlService.updateUrl(url.$id, data).then();
      });
      this.deleteCategory(category);
    });
  }

  async deleteCategory(category: Category) {
    await this.categoryService.deleteCategory(category.$id).then(() => {
      this.categoryService.getUserCategories(this.context.data.user.$id);
      if (this.categoryService.categoryFilter?.$id == category.$id) {
        this.cleanCategoryFilter();
      }
      this.urlService.getUserUrls(this.context.data.user.$id, this.categoryService.categoryFilter?.$id);
    }).catch((error: Error) => {
      console.error(error);
    });
  }

}