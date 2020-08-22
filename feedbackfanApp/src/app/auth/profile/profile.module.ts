import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { ProfilePageGuard } from './profile-can-activate.guard';
import { ProfilePage } from './profile.page';
import { ProfileResolver } from './profile.resolver';
import { ShellModule } from '../../shell/shell.module';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    canActivate: [ProfilePageGuard],
    resolve: {
      data: ProfileResolver
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
    ProfilePageGuard,
    ProfileResolver
  ]
})
export class ProfileModule {}
