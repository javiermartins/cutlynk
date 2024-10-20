import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiLabel } from '@taiga-ui/core';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, TuiButton, TuiInputModule, TuiLabel, TuiTextfieldControllerModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  public user: User;
  public urlForm: FormGroup;

  constructor(
    private authService: AuthService
  ) { }

  async ngOnInit() {
    await this.getUser();
    this.initForm();
  }

  async getUser() {
    this.user = await this.authService.getUser();
  }

  initForm() {
    this.urlForm = new FormGroup({
      userName: new FormControl({ value: this.user.name, disabled: true }),
      email: new FormControl({ value: this.user.email, disabled: true })
    });
  }
}
