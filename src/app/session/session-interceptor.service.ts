import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import {AppAuthService} from "../app-auth.service";
import {LocalStorageService} from 'ngx-webstorage';
import {SessionService} from "./session.service";

@Injectable()
export class SessionInterceptorService implements HttpInterceptor {
  constructor(private injector: Injector) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const localStorage = this.injector.get(LocalStorageService);
    const appAuth = this.injector.get(AppAuthService);
    const session = this.injector.get(SessionService);

    const sessionJWT = localStorage.retrieve('sessionJWT');
    if (sessionJWT && appAuth.isTrustedURL(req.url)) {
      req = req.clone({headers: req.headers.set('Authorization', `Bearer ${sessionJWT}`)})
    }

    const observable = next.handle(req);

    observable.subscribe(
      function onNext(response) {
        // do nothing
      },
      function onError(response) {
        if (response.status === 401) {
          if (appAuth.isRequired) {
            session.logout();
          }
        }
      },
      function onComplete() {
        // do nothing
      }
    );

    return observable;
  }

}
