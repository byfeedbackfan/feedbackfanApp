import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserFinderPage } from './user-finder.page';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ShellModule } from '../shell/shell.module';

const routes: Routes = [
  {
    path: '',
    component: UserFinderPage,
  },
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    TranslateModule,
    ShellModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserFinderPage],
  exports: [RouterModule]
})
export class UserFinderModule {}
