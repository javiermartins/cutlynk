import { Component, inject, INJECTOR, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UrlService } from '../../services/url/url.service';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { TuiButton, TuiDialogOptions, TuiDialogService, TuiIcon, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiCardMedium, TuiHeader } from '@taiga-ui/layout';
import { Clipboard } from '@angular/cdk/clipboard';
import { UrlDetailComponent } from '../../dialogs/url-detail/url-detail.component';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { Url } from '../../models/url.model';

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

    async incrementClicks(url: Url) {
        url.clicks += 1;
        const data = { clicks: url.clicks };
        await this.urlService.updateUrl(url.$id, data).then()
            .catch((error: Error) => {
                console.error(error);
            });
    }

    deleteUrl(url: any) {
        //TODO: confirm dialog
        this.urlService.deleteUrl(url.$id).then(() => {
            this.getUserUrls();
        });
    }

    copyUrlToClipboard(url: any) {
        this.clipboard.copy(`http://localhost:4200/${url.shortUrl}`);
    }

    openUrlDetail(url?: Url) {
        const dialogOptions: Partial<TuiDialogOptions<any>> = {
            closeable: false,
            dismissible: true,
            data: {
                user: this.user,
                url: url
            }
        }

        this.dialogs
            .open(new PolymorpheusComponent(UrlDetailComponent, this.injector), dialogOptions)
            .subscribe({
                next: async (value: any) => {
                    if (value) {
                        await this.getUserUrls();
                    }
                },
            });
    }

}
