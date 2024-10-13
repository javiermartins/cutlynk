import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UrlService } from '../../services/url/url.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

    public urls: any;
    private user: any;

    constructor(
        private authService: AuthService,
        private urlService: UrlService,
        private router: Router
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
            originalUrl: 'https://www.google.com/',
            shortUrl: 'ggle',
            userId: this.user.$id
        }

        await this.urlService.createShortenedUrl(data).then()
            .catch((error: any) => {
                if (error.type == 'document_already_exists') {
                    console.log('Document with the requested ID already exists');
                }
            });
        await this.getUserUrls();
    }

    async getUserUrls() {
        this.urlService.getUserUrls(this.user.$id).then((urls) => {
            this.urls = urls.documents;
        });
    }

    logout() {
        this.authService.logout().then(() => {
            this.router.navigateByUrl('/login')
        });
    }

}
