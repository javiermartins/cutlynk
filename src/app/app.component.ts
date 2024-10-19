import { TuiLoader, TuiRoot } from "@taiga-ui/core";
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthService } from "./services/auth/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, TuiRoot, TuiLoader],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  public loading: boolean = true;

  constructor(
    private authService: AuthService
  ) { }

  async ngOnInit() {
    await this.authService.getUser()
      .then()
      .finally(() => {
        this.loading = false;
      });
  }
}
