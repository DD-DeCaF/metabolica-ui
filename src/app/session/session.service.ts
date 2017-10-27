import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {LocalStorageService} from 'ngx-webstorage';
import 'rxjs/add/operator/toPromise';

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

  get _attributes() {
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

  authenticate(credentials): Promise<any> {
    const promise = this.http.post(`/api/auth`, credentials)
      .toPromise();
    promise.then((response: any) => {
      this.localStorage.store('sessionJWT', response.token);
      // $rootScope.$broadcast('session:login');
    });
    return promise;
  }

  logout(next = null): void {
    this.localStorage.clear('sessionJWT');
    // $rootScope.$broadcast('session:logout', {next});
  }

  login(next = null): void {
    // $rootScope.$broadcast('session:logout', {next});
  }
}
