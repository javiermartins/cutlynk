import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlService } from '../../services/url/url.service';
import { Url } from '../../models/url.model';

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
    private router: Router,
    private route: ActivatedRoute,
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
    this.urlService.getUrlByShortUrl(this.shortUrl).then(async (response) => {
      const urlData: any = response.documents[0];
      if (urlData && urlData.originalUrl) {
        window.location.href = urlData.originalUrl;
        await this.incrementClicks(urlData);
      } else {
        this.router.navigate(['/error']);
      }
    });
  }

  async incrementClicks(url: Url) {
    url.clicks += 1;
    const data = { clicks: url.clicks };
    await this.urlService.updateUrl(url.$id, data).then()
      .catch((error: Error) => {
        console.error(error);
      });
  }

}
