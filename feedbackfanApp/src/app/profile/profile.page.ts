import { Component, OnInit } from '@angular/core';
import { ProfileModel } from './profile.model';

import { Plugins } from '@capacitor/core';
import { ProfileResolver } from './profile.resolver';
import { EditProfileInfoComponent } from './edit-profile-info/edit-profile-info.component';
import { ModalController, PopoverController } from '@ionic/angular';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../core/language/language.service';
import { UserOptionsPopoverComponent } from './user-options-popover/user-options-popover.component';

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
  isPublicable: boolean;
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
    private profileResolver: ProfileResolver,
    private popoverController: PopoverController,
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

  async displayOptionsMenu(ev: any) {
    const popover = await this.popoverController.create({
      component: UserOptionsPopoverComponent,
      componentProps: {user: this.user},
      event: ev,
      mode: 'md',
    });
    return await popover.present();
  }
}
