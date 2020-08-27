import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { ProfilePage } from './profile.page';
import { ShellModule } from '../shell/shell.module';
import { ProfileResolver } from './profile.resolver';
import { EditProfileInfoComponent } from './edit-profile-info/edit-profile-info.component';
import { ProfileGuard } from './profile.guard';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    canActivate: [ProfileGuard],
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
    TranslateModule,
    ShellModule
  ],
  declarations: [
    ProfilePage,
    EditProfileInfoComponent,
  ],
  providers: [
    ProfileResolver,
    ProfileGuard
  ]
})
export class ProfileModule {}
