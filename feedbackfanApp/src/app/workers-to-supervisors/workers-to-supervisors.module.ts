import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkersToSupervisorsPage } from './workers-to-supervisors.page';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { AsignWorkerComponent } from './asign-worker/asign-worker.component';
import { ShellModule } from '../shell/shell.module';

const routes: Routes = [
  {
    path: '',
    component: WorkersToSupervisorsPage,
  },
  {
    path: 'asign-workers',
    component: AsignWorkerComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SharedModule,
    ShellModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    WorkersToSupervisorsPage,
    AsignWorkerComponent,
  ]
})
export class WorkersToSupervisorsModule {}
