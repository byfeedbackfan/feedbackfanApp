import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendedMessagePage } from './sended-message.page';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { ShellModule } from '../shell/shell.module';

const routes: Routes = [
  {
    path: '',
    component: SendedMessagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    IonicModule,
    TranslateModule,
    SharedModule,
    ShellModule,
  ],
  declarations: [SendedMessagePage]
})
export class SendedMessageModule {}
