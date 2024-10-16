import { Component, inject, INJECTOR, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UrlService } from '../../services/url/url.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { TuiButton, TuiDialogOptions, TuiDialogService, TuiIcon, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiCardMedium, TuiHeader } from '@taiga-ui/layout';
import { Clipboard } from '@angular/cdk/clipboard';
import { NewUrlComponent } from '../../dialogs/new-url/new-url.component';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule, TuiButton, TuiInputModule, TuiTextfieldControllerModule,
        TuiCardMedium, TuiTitle, TuiHeader, TuiSurface, TuiIcon
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
    private readonly dialogs = inject(TuiDialogService);
    private readonly injector = inject(INJECTOR);

    public urls: any;
    private user: any;

    constructor(
        private authService: AuthService,
        private urlService: UrlService,
        private clipboard: Clipboard
    ) { }

    ngOnInit() {
        this.getData();
    }

    async getData() {
        await this.getUser();
        await this.getUserUrls();
    }

    async getUser() {
        this.user = await this.authService.getUser();
    }

    async getUserUrls() {
        this.urlService.getUserUrls(this.user.$id).then((urls) => {
            this.urls = urls.documents;
        });
    }

    deleteUrl(url: any) {
        this.urlService.deleteUrl(url.$id).then(() => {
            this.getUserUrls();
        });
    }

    copyUrlToClipboard(url: any) {
        this.clipboard.copy(`http://localhost:4200/${url.shortUrl}`);
    }

    openNewUrl() {
        const dialogOptions: Partial<TuiDialogOptions<any>> = {
            closeable: false,
            dismissible: true,
            data: {
                user: this.user
            }
        }

        this.dialogs
            .open(new PolymorpheusComponent(NewUrlComponent, this.injector), dialogOptions)
            .subscribe({
                next: async (value: any) => {
                    if (value) {
                        await this.getUserUrls();
                    }
                },
            });
    }

}
