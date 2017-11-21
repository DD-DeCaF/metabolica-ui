import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  template: `<router-outlet></router-outlet>`,
  styleUrls: []
})
export class AppComponent {
  title = 'app';
  constructor(router: Router) {
    router.initialNavigation();
  }
}
