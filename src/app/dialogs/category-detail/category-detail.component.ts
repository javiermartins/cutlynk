import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TuiAutoFocus } from '@taiga-ui/cdk';
import { TuiButton, TuiDialogContext, TuiLabel } from '@taiga-ui/core';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { injectContext } from '@taiga-ui/polymorpheus';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category.model';
import { User } from '../../models/user.model';

export class Props {
  user: User;
  category: Category;
}

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule, TuiButton, TuiInputModule, TuiLabel,
    TuiTextfieldControllerModule, TranslateModule, TuiAutoFocus
  ],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.scss'
})
export class CategoryDetailComponent {

  protected readonly context =
    injectContext<TuiDialogContext<boolean, Props>>();
  public categoryForm = new FormGroup({
    name: new FormControl(this.context.data.category?.name ? this.context.data.category.name : '', [Validators.required])
  });

  constructor(
    private categoryService: CategoryService
  ) { }

  async newCategory() {
    const categoryData = {
      name: this.categoryForm.controls['name'].value,
      userId: this.context.data.user.$id
    } as Category;

    await this.categoryService.newCategory(categoryData).then(() => {
      this.context.completeWith(true);
    }).catch((error: Error) => {
      console.error(error);
    });
  }

  async updateCategory() {
    const categoryId = this.context.data.category.$id;
    const categoryData = {
      name: this.categoryForm.controls['name'].value,
    } as Category;

    await this.categoryService.updateCategory(categoryId, categoryData).then(() => {
      this.context.completeWith(true);
    }).catch((error: Error) => {
      console.error(error);
    });
  }

  save() {
    if (this.context.data.category) {
      this.updateCategory();
    } else {
      this.newCategory();
    }
  }

  cancel() {
    this.context.completeWith(false);
  }

}
