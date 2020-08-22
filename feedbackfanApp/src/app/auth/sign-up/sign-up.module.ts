import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SignUpPage } from './sign-up.page';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { ShellModule } from '../../shell/shell.module';


const routes: Routes = [
  {
    path: '',
    component: SignUpPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    CoreModule,
    ShellModule,
  ],
  declarations: [SignUpPage]
})
export class SignUpModule {}
