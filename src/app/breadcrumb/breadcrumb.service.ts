import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from './page';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  public collection: BehaviorSubject<Page[]>;
  private pages: Page[] = [];
  private homepage: Page = new Page('Home', '/');

  constructor(public router: Router) {
    this.pages.push(this.homepage);
    this.collection = new BehaviorSubject(this.pages);
  }

  public serializePages(url: string) {
    const routes = url.split('?')[0].split('/');

    // Reset Breadcrumb
    this.pages = [];
    this.pages.push(this.homepage);

    // Load actual URL
    routes.filter(param => param !== 'about').forEach(route => {
      if (route !== '/' && route !== undefined && route != null && route !== '') {
        this.pages.push(new Page(decodeURI(route.charAt(0).toUpperCase() + route.slice(1)), this.processRouteURL(url, route)));
      }
    });

    // Update Breadcrumb
    this.collection.next(this.pages);
  }

  private processRouteURL(url: string, route: string): string {
    return url.substring(0, url.lastIndexOf(route)) + route;
  }

  public navigate(url: string) {
    if (url.split('/')[url.split('/').length - 1] !== this.router.url) {
      this.router.navigateByUrl(url);
    }
  }


}
