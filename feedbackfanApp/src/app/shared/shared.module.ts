import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';
import { IonicModule } from '@ionic/angular';
import { MessagesNavigationBarComponent } from './messages-navigation-bar/messages-navigation-bar.component';
import { ShortNumberSuffixPipe } from './pipes/short-number-suffix.pipe';
import { FilterSearchUsersPipe } from './pipes/filter-search-users.pipe';

@NgModule({
  declarations: [
    ShowHidePasswordComponent,
    MessagesNavigationBarComponent,
    ShortNumberSuffixPipe,
    FilterSearchUsersPipe,
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot()
  ],
  exports: [
    ShowHidePasswordComponent,
    MessagesNavigationBarComponent,
    ShortNumberSuffixPipe,
    FilterSearchUsersPipe,
  ]
})
export class SharedModule { }
