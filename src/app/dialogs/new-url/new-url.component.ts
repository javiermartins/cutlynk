import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDialogContext, TuiIcon, TuiLabel, TuiTextfield } from '@taiga-ui/core';
import { TuiInputModule, TuiTextareaModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { injectContext } from '@taiga-ui/polymorpheus';
import { UrlService } from '../../services/url/url.service';
import { Constants } from '../../utils/constants';
import { Error } from '../../models/error.model';

export class Props {
  user: any;
}

@Component({
  selector: 'app-new-url',
  standalone: true,
  imports: [
    ReactiveFormsModule, TuiButton, TuiInputModule, TuiLabel, TuiTextfieldControllerModule,
    TuiTextfield, TuiTextareaModule, TuiIcon
  ],
  templateUrl: './new-url.component.html',
  styleUrl: './new-url.component.scss'
})
export class NewUrlComponent {
  protected readonly context =
    injectContext<TuiDialogContext<boolean, Props>>();

  public urlPattern: string = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  public saving: boolean = false;
  public urlForm = new FormGroup({
    originalUrl: new FormControl('', [Validators.required, Validators.pattern(this.urlPattern)]),
    shortUrl: new FormControl('', [Validators.required]),
    description: new FormControl('')
  });

  constructor(
    private urlService: UrlService
  ) { }


  async createShortenedUrl() {
    const data = {
      originalUrl: this.urlForm.controls['originalUrl'].value,
      shortUrl: this.urlForm.controls['shortUrl'].value,
      userId: this.context.data.user.$id,
      description: this.urlForm.controls['description'].value
    }

    await this.urlService.createShortenedUrl(data).then(() => {
      this.urlForm.controls['originalUrl'].setValue('');
      this.context.completeWith(true);
    }).catch((error: Error) => {
      if (error.type == Constants.ERRORS.DOCUMENT_EXISTS) {
        console.log('Document with the requested ID already exists');
      }
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

}
