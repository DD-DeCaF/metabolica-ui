import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {MatDialog} from "@angular/material";
import {MaintenanceDialogComponent} from "./maintenance-dialog.component";
import {HttpClient} from "@angular/common/http";
import {HttpBufferService} from "./http-buffer.service";


@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  dialogIsOpen: boolean = false;

  constructor(public dialog: MatDialog, private injector: Injector) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const buffer = this.injector.get(HttpBufferService);
    return next.handle(request).do(() => {},
      error => {
        if ([502, 503].includes(error.status)) {
          buffer.append(request);
          if (!this.dialogIsOpen) {
           this.dialogIsOpen = true;
           this.dialog.open(MaintenanceDialogComponent)
             .afterClosed().subscribe(() => {
             this.dialogIsOpen = false;
             buffer.retryAll();
           });
         }
        }
      });
  }
}


