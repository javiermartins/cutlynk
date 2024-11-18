import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDataList, TuiDialogContext, TuiIcon, TuiLabel, TuiTextfield } from '@taiga-ui/core';
import { TuiInputModule, TuiSelectModule, TuiTextareaModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { injectContext } from '@taiga-ui/polymorpheus';
import { UrlService } from '../../services/url/url.service';
import { Constants } from '../../utils/constants';
import { Error } from '../../models/error.model';
import { Url } from '../../models/url.model';
import { User } from '../../models/user.model';
import { toast, NgxSonnerToaster } from 'ngx-sonner';
import { TuiAutoFocus, TuiContext, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category.model';

export class Props {
  user: User;
  url: Url;
}

@Component({
  selector: 'app-url-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule, TuiButton, TuiInputModule, TuiLabel, TuiTextfieldControllerModule,
    TuiTextfield, TuiTextareaModule, TuiIcon, NgxSonnerToaster, TuiAutoFocus, TranslateModule,
    TuiSelectModule, TuiDataList, TuiDataListWrapper
  ],
  templateUrl: './url-detail.component.html',
  styleUrl: './url-detail.component.scss'
})
export class UrlDetailComponent {
  protected readonly context =
    injectContext<TuiDialogContext<boolean, Props>>();
  protected readonly toast = toast;
  public categories: Category[];

  private originalUrlPattern: string = '^(https?:\/\/)?([\\da-z.-]+)\\.[a-z.]{2,6}(\/[\\/\\w.-]*)*(\\?[\\w=&.-]+)?$';
  private shortUrlPattern: string = '^[a-zA-Z0-9-]+$';
  public saving: boolean = false;
  public urlData = this.context.data.url;
  public urlForm = new FormGroup({
    originalUrl: new FormControl(this.urlData ? this.urlData.originalUrl : '', [Validators.required, Validators.pattern(this.originalUrlPattern)]),
    shortUrl: new FormControl(this.urlData ? this.urlData.shortUrl : '', [Validators.required, Validators.pattern(this.shortUrlPattern)]),
    category: new FormControl(this.urlData?.categoryId ? this.urlData.categoryId : -1),
    description: new FormControl(this.urlData?.description ? this.urlData.description : '')
  });

  constructor(
    private urlService: UrlService,
    private categoryService: CategoryService,
    private translateService: TranslateService
  ) {
    this.getUserCategories();
  }

  save() {
    if (this.urlData) {
      this.updateUrl();
    } else {
      this.createShortenedUrl();
    }
  }

  async updateUrl() {
    const data = this.getUrlData();

    await this.urlService.updateUrl(this.urlData.$id, data).then(() => {
      this.urlForm.controls['originalUrl'].setValue('');
      this.context.completeWith(true);
    }).catch((error: Error) => {
      this.duplicateShortUrlNotification(error);
    });
  }

  async createShortenedUrl() {
    const data = this.getUrlData();

    await this.urlService.createShortenedUrl(data).then(() => {
      this.urlForm.controls['originalUrl'].setValue('');
      this.context.completeWith(true);
    }).catch((error: Error) => {
      this.duplicateShortUrlNotification(error);
    });
  }

  duplicateShortUrlNotification(error: Error) {
    if (error.type == Constants.ERRORS.DOCUMENT_EXISTS) {
      toast.warning('This short URL already exists. Please try another one.');
      this.urlForm.controls['shortUrl'].setErrors({ 'incorrect': true });
    }
  }

  getUrlData(): Url {
    const categoryId = this.urlForm.controls['category'].value;

    return {
      originalUrl: this.urlForm.controls['originalUrl'].value,
      shortUrl: this.urlForm.controls['shortUrl'].value,
      userId: this.context.data.user.$id,
      categoryId: categoryId !== -1 ? categoryId : null,
      description: this.urlForm.controls['description'].value
    } as Url;
  }

  async getUserCategories() {
    this.categoryService.categories$.subscribe((categories) => {
      this.categories = categories;
    });
  }

  base62Encode() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = 6;
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }

    this.urlForm.controls['shortUrl'].setValue(result);
  }

  cancel() {
    this.context.completeWith(false);
  }

  @tuiPure
  protected stringify(items: any[]): TuiStringHandler<TuiContext<number>> {
    const map = new Map(items.map(({ $id, name }) => [$id, name] as [number, string]));

    return ({ $implicit }: TuiContext<number>) => {
      if ($implicit === -1) {
        return this.translateService.instant('CATEGORY.UNCATEGORIZED');
      }

      return map.get($implicit) || '';
    };
  }

}
