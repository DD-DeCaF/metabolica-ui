import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpInterceptorService} from './http-interceptor.service';
import {AppMaterialModule} from '../app-material.module';
import {MaintenanceDialogComponent} from './maintenance-dialog.component';
import {HttpBufferService} from './http-buffer.service';


@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule
  ],
  declarations: [MaintenanceDialogComponent],
  entryComponents: [MaintenanceDialogComponent],
  providers: [
    HttpBufferService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    }
  ]
})
export class MaintenanceModule { }
