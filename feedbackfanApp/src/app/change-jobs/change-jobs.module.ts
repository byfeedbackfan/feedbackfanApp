import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeJobsPage } from './change-jobs.page';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { ShellModule } from '../shell/shell.module';

const routes: Routes = [
  {
    path: '',
    component: ChangeJobsPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SharedModule,
    ShellModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ChangeJobsPage],
  exports: [
    ChangeJobsPage,
  ]
})
export class ChangeJobsModule {}
