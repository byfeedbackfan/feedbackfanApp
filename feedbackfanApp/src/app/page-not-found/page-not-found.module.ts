import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageNotFoundPage } from './page-not-found.page';
import { ShellModule } from '../shell/shell.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ShellModule,
    TranslateModule,
    RouterModule.forChild([
      {
         path: '',
         component: PageNotFoundPage
      }
    ])
  ],
  declarations: [PageNotFoundPage]
})
export class PageNotFoundModule {}
