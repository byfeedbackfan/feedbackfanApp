import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ResetPasswordPage } from './reset-password.page';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ResetPasswordResolver } from './reset-password.resolver';

const routes: Routes = [
  {
    path: '',
    component: ResetPasswordPage,
    resolve: {
      ResetPasswordResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    SharedModule
  ],
  declarations: [
    ResetPasswordPage,
  ],
  providers: [
    ResetPasswordResolver,
  ]
})
export class ResetPasswordModule {}
