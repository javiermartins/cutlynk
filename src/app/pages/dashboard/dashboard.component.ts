import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UrlService } from '../../services/url/url.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { TuiButton, TuiIcon, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiCardMedium, TuiHeader } from '@taiga-ui/layout';
import { Clipboard } from '@angular/cdk/clipboard';

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

    public urls: any;
    private user: any;
    protected readonly form = new FormGroup({
        originalUrl: new FormControl(''),
    });

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

    async createShortenedUrl() {
        const data = {
            originalUrl: this.form.controls['originalUrl'].value,
            shortUrl: this.base62Encode(),
            userId: this.user.$id
        }

        await this.urlService.createShortenedUrl(data).then(() => {
            this.form.controls['originalUrl'].setValue('');
        }).catch((error: any) => {
            if (error.type == 'document_already_exists') {
                console.log('Document with the requested ID already exists');
            }
        });
        await this.getUserUrls();
    }

    base62Encode(): string {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
        const length = 6;
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
        }

        return result;
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

}
