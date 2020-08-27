import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';
import { IonicModule } from '@ionic/angular';
import { MessagesNavigationBarComponent } from './messages-navigation-bar/messages-navigation-bar.component';
import { ShortNumberSuffixPipe } from './pipes/short-number-suffix.pipe';

@NgModule({
  declarations: [
    ShowHidePasswordComponent,
    MessagesNavigationBarComponent,
    ShortNumberSuffixPipe,
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot()
  ],
  exports: [
    ShowHidePasswordComponent,
    MessagesNavigationBarComponent,
    ShortNumberSuffixPipe
  ]
})
export class SharedModule { }
