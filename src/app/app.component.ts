import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { TuiRoot } from "@taiga-ui/core";
import languages from "./data/languages";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TuiRoot],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private translateService = inject(TranslateService);

  ngOnInit() {
    this.setLanguage();
  }

  async setLanguage() {
    const browserLang = this.translateService.getBrowserLang();
    this.translateService.setDefaultLang(browserLang ? browserLang : 'en');
    this.translateService.use(browserLang);

    const supportedLangs = languages.map(language => language.id);
    supportedLangs.forEach((language) => {
      this.translateService.reloadLang(language);
    });
  }
}
