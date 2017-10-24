import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import {AppAuthService} from "../app-auth.service";
import {LocalStorageService} from 'ngx-webstorage';
import {SessionService} from "./session.service";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SessionInterceptorService implements HttpInterceptor {
  constructor(private localStorage:LocalStorageService, private appAuth: AppAuthService, private session: SessionService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const sessionJWT = this.localStorage.retrieve('sessionJWT');
    if (sessionJWT && this.appAuth.isTrustedURL(req.url)){
      req = req.clone({headers: req.headers.set('Authorization', `Bearer ${sessionJWT}`)})
    }

    return next.handle(req)

    // return next.handle(req).do(response => {
    //   if(response instanceof HttpResponse){
    //       if(response.status === 401){
    //         if(this.appAuth.isRequired){
    //           this.session.logout();
    //         }
    //       }
    //   }
    // });
  }

}
