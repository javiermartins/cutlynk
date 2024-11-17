import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { HeaderComponent } from '../header/header.component';
import { TranslateService } from '@ngx-translate/core';
import { TuiLoader, tuiLoaderOptionsProvider } from '@taiga-ui/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, TuiLoader],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  providers: [tuiLoaderOptionsProvider({ size: 'xl' })]
})
export class LayoutComponent implements OnInit {

  public user: User;
  public loading: boolean = true;

  constructor(
    private authService: AuthService,
    private translateService: TranslateService
  ) { }

  async ngOnInit() {
    await this.getUser();
    await this.authService.checkAndCreateUser();
  }

  async getUser() {
    await this.authService.getUser()
      .then((user: User) => {
        this.user = user;
        this.setUserLanguage();
      }).finally(() => {
        this.loading = false;
      });
  }

  setUserLanguage() {
    this.translateService.use(this.user.language);
  }

}
