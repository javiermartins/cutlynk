import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiDataList, TuiLabel } from '@taiga-ui/core';
import { TuiInputModule, TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { AuthService } from '../../services/auth/auth.service';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { TuiContext, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Language } from '../../models/language.model';
import languages from '../../data/languages';
import { SettingsService } from '../../services/settings/settings.service';
import { version } from '../../../../package.json';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TuiInputModule, TuiLabel,
    TuiTextfieldControllerModule, TuiDataList, TuiDataListWrapper, TuiSelectModule,
    TranslateModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  public version: string = version;
  public user: User;
  public urlForm: FormGroup;
  public languages: Language[] = languages;

  constructor(
    private settingsService: SettingsService,
    private authService: AuthService,
    private translateService: TranslateService
  ) { }

  async ngOnInit() {
    await this.getUser();
    this.initForm();
  }

  async getUser() {
    this.user = await this.authService.getUser();
  }

  initForm() {
    const language = languages.find((language) => language.id === this.user.language);

    this.urlForm = new FormGroup({
      userName: new FormControl({ value: this.user.name, disabled: true }),
      email: new FormControl({ value: this.user.email, disabled: true }),
      language: new FormControl(language ? language : this.languages[0]),
    });
  }

  changeLanguage(languageId: string) {
    this.translateService.use(languageId);
    this.settingsService.setLanguage(this.user, languageId);
  }

  @tuiPure
  protected stringify(items: readonly any[]): TuiStringHandler<TuiContext<number>> {
    const map = new Map(items.map(({ id, name }) => [id, name] as [number, string]));

    return ({ $implicit }: TuiContext<number>) => map.get($implicit) || '';
  }
}
