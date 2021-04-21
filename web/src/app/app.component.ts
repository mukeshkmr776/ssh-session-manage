import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'web';

  loading: boolean;
  currentUrl: string;
  isWelcomePage = false;
  darkBackground = false;

  mobileQuery: MediaQueryList;
  mobileQueryListener: () => void;

  sidenavOptions: FormGroup;
  @ViewChild('sidenav', {static: true}) sidenav;

  pages = [
    {
      name: 'Welcome',
      link: '/welcome',
      icon: 'home',
      selected: true,
      divider: true,
      darkBackground: false
    },
    {
      name: 'Nodes',
      link: '/nodes',
      icon: 'scatter_plot',
      selected: false,
      divider: false,
      darkBackground: false
    },
    {
      name: 'Session',
      link: '/sessions',
      icon: 'scatter_plot',
      selected: false,
      divider: false,
      darkBackground: true
    }
  ];


  constructor(fb: FormBuilder, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router) {
    this.loading = true;
    this.sidenavOptions = fb.group({
      top: 50,
      bottom: 50
    });
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.currentUrl = event.url;
        if (this.currentUrl === '/') {
          this.isWelcomePage = true;
        }
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        if (this.currentUrl === '/') {
          this.isWelcomePage = true;
        }
        console.log(this.currentUrl);
      }
    });
  }


  showPage(page: any) {
    this.pages.forEach(p => p.selected = false);
    page.selected = true;

    // if (page.darkBackground) {
    //   this.darkBackground = true;
    // } else {
    //   this.darkBackground = false;
    // }

    this.router.navigateByUrl(page.link);
  }

  switchMode() {
    this.darkBackground = !this.darkBackground;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }
}
