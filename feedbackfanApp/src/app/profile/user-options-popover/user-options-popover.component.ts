import { Component, OnInit } from '@angular/core';
import { ProfileModel } from '../profile.model';
import { AuthService } from '../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/core/language/language.service';
import { UserService } from '../../core/services/user.service';
import { Subscription } from 'rxjs';
import { icons } from '../../../configuration/icons';

const { Storage } = Plugins;

@Component({
  selector: 'app-user-options-popover',
  templateUrl: './user-options-popover.component.html',
  styleUrls: ['./user-options-popover.component.scss'],
})
export class UserOptionsPopoverComponent implements OnInit {
  user: ProfileModel = this.navParams.get('user');
  isPublicable = this.user.allMessagesPublic;
  translations;
  subscriptions: Subscription;
  icons = icons;

  constructor(
    public translate: TranslateService,
    public languageService: LanguageService,
    public navParams: NavParams,
    private authService: AuthService,
    private router: Router,
    private popoverController: PopoverController,
    private userService: UserService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.subscriptions = this.route.data.subscribe();
    this.getTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.getTranslations();
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
      this.popoverController.dismiss();
      this.subscriptions.unsubscribe();
      this.router.navigate(['auth/sign-in'], { replaceUrl: true });
    }, (error) => {
      console.log('signout error', error);
    });
  }

  async changePublishableProperty() {
    this.user.allMessagesPublic = !this.user.allMessagesPublic;
    await this.userService.updateUser(this.user).then(async () => {
      await Storage.set({key: 'userCredentials', value: JSON.stringify(this.user)});
    });
  }

}
