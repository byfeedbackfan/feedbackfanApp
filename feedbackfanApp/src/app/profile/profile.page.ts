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

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../core/language/language.service';

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
  translations;

  constructor(
    public translate: TranslateService,
    public languageService: LanguageService,
    private router: Router,
    private authService: AuthService,
    private profileResolver: ProfileResolver,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.getTranslations();
    });
    this.profileResolver.resolve().then((user) => {
      this.user = user;
    });
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => {
      this.translations = translations;
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
      this.user.name = data.name;
    }
  }
}
