import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  async shortUrl() {
    const isAuth = await this.authService.isAuthenticated();

    if (isAuth) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
