import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UrlService } from '../../services/url/url.service';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.scss'
})
export class RedirectComponent {

  private shortUrl: string = '';

  constructor(
    private urlService: UrlService,
    private route: ActivatedRoute
  ) {
    this.getshortUrl();
  }

  getshortUrl() {
    this.route.paramMap.subscribe(async (params) => {
      this.shortUrl = params.get('shortUrl')!;
      this.getUrlByShortUrl();
    });
  }

  getUrlByShortUrl() {
    this.urlService.getUrlByShortUrl(this.shortUrl).then((response) => {
      const urlData: any = response.documents[0];
      if (urlData && urlData.originalUrl) {
        window.location.href = urlData.originalUrl;
      } else {
        //TODO: redirect to error
      }
    });
  }

}
