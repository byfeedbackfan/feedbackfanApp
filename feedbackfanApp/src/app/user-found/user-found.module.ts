import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserFoundPage } from './user-found.page';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { ShellModule } from '../shell/shell.module';

const routes: Routes = [
  {
    path: '',
    component: UserFoundPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShellModule,
    RouterModule.forChild(routes),
    TranslateModule,
    SharedModule,
  ],
  declarations: [UserFoundPage]
})
export class UserFoundModule {}
