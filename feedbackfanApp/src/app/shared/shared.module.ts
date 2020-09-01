import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';
import { IonicModule } from '@ionic/angular';
import { MessagesNavigationBarComponent } from './messages-navigation-bar/messages-navigation-bar.component';
import { ShortNumberSuffixPipe } from './pipes/short-number-suffix.pipe';
import { FilterSearchPipe } from './pipes/filter-search.pipe';
import { HideHeaderDirective } from './directives/hide-header.directive';
import { FilterMessagePublishablePipe } from './pipes/filter-message-publishable';
import { MessageDetailComponent } from './message-detail/message-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  declarations: [
    ShowHidePasswordComponent,
    MessagesNavigationBarComponent,
    ShortNumberSuffixPipe,
    FilterSearchPipe,
    HideHeaderDirective,
    FilterMessagePublishablePipe,
    MessageDetailComponent,
    SafeHtmlPipe,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    IonicModule.forRoot()
  ],
  exports: [
    ShowHidePasswordComponent,
    MessagesNavigationBarComponent,
    MessageDetailComponent,
    ShortNumberSuffixPipe,
    FilterSearchPipe,
    FilterMessagePublishablePipe,
    HideHeaderDirective,
    SafeHtmlPipe,
  ]
})
export class SharedModule { }
