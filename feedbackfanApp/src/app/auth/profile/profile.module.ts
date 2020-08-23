import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { ProfilePage } from './profile.page';
import { ShellModule } from '../../shell/shell.module';
import { ProfileResolver } from './profile.resolver';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    resolve: {
      data: ProfileResolver,
    }
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
    ShellModule
  ],
  declarations: [
    ProfilePage
  ],
  providers: [
    ProfileResolver,
  ]
})
export class ProfileModule {}
