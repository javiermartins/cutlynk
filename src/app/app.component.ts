import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { TuiRoot } from "@taiga-ui/core";
import languages from "./data/languages";
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TuiRoot],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(
    private translateService: TranslateService,
    private renderer: Renderer2,
    private meta: Meta
  ) { }

  async ngOnInit() {
    await this.setLanguage();

  const initialDescription = this.translateService.instant('META.DESCRIPTION');
  this.meta.updateTag({ name: 'description', content: initialDescription });

  this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
    this.renderer.setAttribute(document.documentElement, 'lang', event.lang);

    const description = this.translateService.instant('META.DESCRIPTION');
    this.meta.updateTag({ name: 'description', content: description });
  });
  }

  async setLanguage() {
    const browserLang = this.translateService.getBrowserLang();
    const defaultLang = browserLang ? browserLang : 'en';

    this.translateService.setDefaultLang(defaultLang);
    this.translateService.use(defaultLang);

    const supportedLangs = languages.map(language => language.id);
    supportedLangs.forEach((language) => {
      this.translateService.reloadLang(language);
    });

    this.renderer.setAttribute(document.documentElement, 'lang', defaultLang);
  }
}
