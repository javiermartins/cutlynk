import { TuiLoader, TuiRoot } from "@taiga-ui/core";
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { TranslateService } from "@ngx-translate/core";
import languages from "./data/languages";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, TuiRoot, TuiLoader],
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
