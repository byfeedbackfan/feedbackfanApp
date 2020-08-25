import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    ShowHidePasswordComponent,
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot()
  ],
  exports: [
    ShowHidePasswordComponent,
  ]
})
export class SharedModule { }
