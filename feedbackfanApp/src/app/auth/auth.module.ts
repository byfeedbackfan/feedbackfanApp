import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';
import { AuthService } from '../core/services/auth.service';
import { SignInModule } from './sign-in/sign-in.module';
import { ProfileModule } from './profile/profile.module';
import { SignUpModule } from './sign-up/sign-up.module';
import { CoreModule } from '../core/core.module';
import { ShellModule } from '../shell/shell.module';

const routes: Routes = [
  {
    path: 'sign-in',
    loadChildren: () => import('./sign-in/sign-in.module').then(m => m.SignInModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./sign-up/sign-up.module').then(m => m.SignUpModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    SignInModule,
    SignUpModule,
    ProfileModule,
    CoreModule
  ],
  providers: [AuthService]
})
export class FirebaseAuthModule {}
