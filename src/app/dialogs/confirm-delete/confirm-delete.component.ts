import { Component } from '@angular/core';
import { TuiButton, TuiDialogContext } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { Url } from '../../models/url.model';
import { UrlService } from '../../services/url/url.service';
import { TranslateModule } from '@ngx-translate/core';

export class Props {
  header: string;
  description: string;
  url?: Url;
}

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [TuiButton, TranslateModule],
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.scss'
})
export class ConfirmDeleteComponent {
  protected readonly context =
    injectContext<TuiDialogContext<boolean, Props>>();

  constructor(
    private urlService: UrlService
  ) { }

  delete() {
    if (this.context.data?.url) {
      this.urlService.deleteUrl(this.context.data.url.$id).then(() => {
        this.context.completeWith(true);
      });
    } else {
      this.context.completeWith(true);
    }
  }

  cancel() {
    this.context.completeWith(false);
  }
}
