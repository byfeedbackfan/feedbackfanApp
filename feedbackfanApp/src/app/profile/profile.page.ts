import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileModel } from './profile.model';
import { AuthService } from '../core/services/auth.service';

import { Plugins } from '@capacitor/core';
import { ProfileResolver } from './profile.resolver';
import { EditProfileInfoComponent } from './edit-profile-info/edit-profile-info.component';
import { ModalController } from '@ionic/angular';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

const { Storage } = Plugins;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: [
    './styles/profile.page.scss',
    './styles/profile.shell.scss'
  ]
})
export class ProfilePage implements OnInit {
  user: ProfileModel;
  signupForm: FormGroup;
  // tslint:disable-next-line: variable-name
  matching_passwords_group: FormGroup;
  submitError: string;
  redirectLoader: HTMLIonLoadingElement;
  authRedirectResult: Subscription;

  imageFilePath = '../../../assets/icons/no-profile-picture.jpg';
  imageFile: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileResolver: ProfileResolver,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.profileResolver.resolve().then((user) => {
      this.user = user;
    });
  }

  signOut() {
    this.authService.signOut().subscribe(() => {
      Storage.clear();
      this.router.navigate(['auth/sign-in'], { replaceUrl: true });
    }, (error) => {
      console.log('signout error', error);
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: EditProfileInfoComponent,
      componentProps: {
        userCredentials: this.user,
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      this.user.image = data.imageUrl;
    }
  }
}
