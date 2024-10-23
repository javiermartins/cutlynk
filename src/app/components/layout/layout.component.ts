import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { HeaderComponent } from '../header/header.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {

  public user: any;

  constructor(
    private authService: AuthService,
    private translateService: TranslateService
  ) { }

  async ngOnInit() {
    this.setUserLanguage();
    await this.authService.checkAndCreateUser();
  }

  async setUserLanguage() {
    this.user = await this.authService.getUser();
    this.translateService.use(this.user.language);
  }

}
