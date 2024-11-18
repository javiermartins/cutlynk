import { Component, inject, INJECTOR } from '@angular/core';
import { TuiButton, TuiDialogContext, TuiDialogOptions, TuiDialogService, TuiIcon } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/legacy';
import { CategoryDetailComponent } from '../category-detail/category-detail.component';
import { injectContext, PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../models/user.model';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category.model';

export class Props {
  user: User;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [TuiButton, TuiInputModule, TuiIcon, TranslateModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  protected readonly context =
    injectContext<TuiDialogContext<boolean, Props>>();
  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(INJECTOR);
  public categories: Category[];

  constructor(
    private categoryService: CategoryService
  ) {
    this.getUserCategories();
  }

  async getUserCategories() {
    this.categoryService.categories$.subscribe((categories) => {
      this.categories = categories;
    });
  }

  openCategoryDetail(event?: Event, category?: Category) {
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
        },
      });
  }
}
