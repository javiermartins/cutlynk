import { Component, inject, INJECTOR, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UrlService } from '../../services/url/url.service';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { TuiButton, TuiDialogOptions, TuiDialogService, TuiIcon, TuiLoader, tuiLoaderOptionsProvider, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiCardMedium, TuiHeader } from '@taiga-ui/layout';
import { Clipboard } from '@angular/cdk/clipboard';
import { UrlDetailComponent } from '../../dialogs/url-detail/url-detail.component';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { Url } from '../../models/url.model';
import { ConfirmDeleteComponent } from '../../dialogs/confirm-delete/confirm-delete.component';
import { toast, NgxSonnerToaster } from 'ngx-sonner';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, ReactiveFormsModule, TuiButton, TuiInputModule, TuiTextfieldControllerModule,
        TuiCardMedium, TuiTitle, TuiHeader, TuiSurface, TuiIcon, NgxSonnerToaster, TuiLoader
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    providers: [tuiLoaderOptionsProvider({ size: 'l' })]
})
export class DashboardComponent implements OnInit {
    private readonly dialogs = inject(TuiDialogService);
    private readonly injector = inject(INJECTOR);
    protected readonly toast = toast;

    public urls: any[];
    private user: User;
    public loading: boolean = true;
    public activeIndex: number | null = null;
    public removingIndex: number | null = null;

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
        }).finally(() => {
            this.loading = false;
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

    openDeleteUrl(url: Url, index: number) {
        const dialogOptions: Partial<TuiDialogOptions<any>> = {
            closeable: false,
            dismissible: true,
            data: {
                url: url
            }
        }

        this.dialogs
            .open(new PolymorpheusComponent(ConfirmDeleteComponent, this.injector), dialogOptions)
            .subscribe({
                next: async (value: any) => {
                    if (value) {
                        this.removingIndex = index;
                        setTimeout(() => {
                            this.urls.splice(index, 1);
                            this.removingIndex = null;
                        }, 400);
                    }
                },
            });
    }

    copyUrlToClipboard(url: any, index: number) {
        this.clipboard.copy(`http://localhost:4200/${url.shortUrl}`);
        this.activeIndex = index;
        setTimeout(() => {
            this.activeIndex = null;
        }, 2000);
        toast('Url copied to clipboard', { duration: 2000 });
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
