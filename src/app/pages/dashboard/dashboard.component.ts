import { Component, inject, INJECTOR, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UrlService } from '../../services/url/url.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { TuiButton, TuiDialogOptions, TuiDialogService, TuiHintDirective, TuiIcon, TuiLoader, tuiLoaderOptionsProvider, TuiSurface, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiCardMedium } from '@taiga-ui/layout';
import { Clipboard } from '@angular/cdk/clipboard';
import { UrlDetailComponent } from '../../dialogs/url-detail/url-detail.component';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { Url } from '../../models/url.model';
import { ConfirmDeleteComponent } from '../../dialogs/confirm-delete/confirm-delete.component';
import { toast, NgxSonnerToaster } from 'ngx-sonner';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SearchPipe } from '../../utils/pipes/search.pipe';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';
import { CategoriesComponent } from '../../dialogs/categories/categories.component';
import { CategoryService } from '../../services/category/category.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, TuiButton, TuiInputModule, TuiTextfieldControllerModule, TuiTextfield,
        TuiCardMedium, TuiTitle, TuiSurface, TuiIcon, NgxSonnerToaster, TuiLoader, TranslateModule, SearchPipe, TuiHintDirective
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    providers: [tuiLoaderOptionsProvider({ size: 'l' })]
})
export class DashboardComponent implements OnInit {
    private readonly dialogs = inject(TuiDialogService);
    private readonly injector = inject(INJECTOR);
    protected readonly toast = toast;

    public urls: Url[];
    private user: User;
    public loading: boolean = true;
    public activeIndex: number | null = null;
    public removingIndex: number | null = null;
    public searchUrl: string = '';

    constructor(
        private authService: AuthService,
        private urlService: UrlService,
        public categoryService: CategoryService,
        private clipboard: Clipboard,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.getData();
    }

    async getData() {
        await this.getUser();
        await this.loadUrls();
    }

    async getUser() {
        this.user = await this.authService.getUser();
    }

    async loadUrls() {
        await this.urlService.urls$.subscribe((urls) => {
            this.urls = urls;
        });
        this.loading = false;
    }

    async getUserUrls() {
        const categoryId = this.categoryService.categoryFilter?.$id;
        await this.urlService.getUserUrls(this.user.$id, categoryId);
        this.loading = false;
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
                header: 'DASHBOARD.CONFIRMDELETETITLE',
                description: 'DASHBOARD.CONFIRMDELETEDESCRIPTION',
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

    copyUrlToClipboard(url: Url, index: number) {
        this.clipboard.copy(`${environment.BASE_URL}/${url.shortUrl}`);
        this.activeIndex = index;
        setTimeout(() => {
            this.activeIndex = null;
        }, 2000);
        toast.info(this.translate.instant('DASHBOARD.COPIEDCLIPBOARD'), { duration: 2000 });
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

    openCategories() {
        const categoryId = this.categoryService.categoryFilter?.$id;
        const dialogOptions: Partial<TuiDialogOptions<any>> = {
            closeable: false,
            dismissible: true,
            data: {
                user: this.user
            }
        }

        this.dialogs
            .open(new PolymorpheusComponent(CategoriesComponent, this.injector), dialogOptions)
            .subscribe({
                complete: () => {
                    if (this.categoryService.categoryFilter?.$id != categoryId) {
                        this.getUserUrls();
                    }
                }
            });
    }

}
