import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { AppMaterialModule} from "../app-material.module";
import { FormsModule} from "@angular/forms";
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    FormsModule,
    FlexLayoutModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
