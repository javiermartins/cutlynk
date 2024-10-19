import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [TuiButton, TuiIcon],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  async goHome() {
    const isAuth = await this.authService.isAuthenticated();

    if (isAuth) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
