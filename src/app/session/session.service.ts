import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from 'ngx-webstorage';
import 'rxjs/add/operator/toPromise';

import {User} from '../app.resources';

@Injectable()
export class SessionService {

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
  }

  isAuthenticated(): boolean {
    return this.expires > new Date();
  }

  get expires() {
    const sessionJWT = this.localStorage.retrieve('sessionJWT');

    if (sessionJWT) {
      try {
        return new Date(JSON.parse(atob(sessionJWT.split('.')[0])).exp * 1000);
      } catch (e) {
        return new Date(0);
      }
    } else {
      return new Date(0);
    }
  }

  private get attributes() {
    const sessionJWT = this.localStorage.retrieve('sessionJWT');
    if (sessionJWT) {
      try {
        return JSON.parse(atob(sessionJWT.split('.')[1]));
      } catch (e) {
        return {};
      }
    } else {
      return {};
    }
  }

  getCurrentUser() {
    if (!this.isAuthenticated()) {
      return null;
    }

    const attrs = this.attributes;
    if (attrs.userId) {
      return User.fetch(attrs.userId, {cache: false});
    } else {
      return User.current();
    }
  }

  authenticate(credentials): Promise<any> {
    return this.http.post(`/api/auth`, credentials)
      .toPromise().then((response: any) => {
        this.localStorage.store('sessionJWT', response.token);
        // $rootScope.$broadcast('session:login');
      });
  }

  logout(next = null): void {
    this.localStorage.clear('sessionJWT');
    // $rootScope.$broadcast('session:logout', {next});
  }

  login(next = null): void {
    // $rootScope.$broadcast('session:logout', {next});
  }
}
