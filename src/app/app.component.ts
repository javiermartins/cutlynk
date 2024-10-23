import { TuiLoader, TuiRoot } from "@taiga-ui/core";
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthService } from "./services/auth/auth.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, TuiRoot, TuiLoader],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private translateService = inject(TranslateService);

  public loading: boolean = true;

  constructor(
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.setLanguage();
    await this.authService.getUser()
      .then()
      .finally(() => {
        this.loading = false;
      });
  }

  setLanguage() {
    const browserLang = this.translateService.getBrowserLang();
    this.translateService.setDefaultLang('en');
    this.translateService.use(browserLang);
  }
}
