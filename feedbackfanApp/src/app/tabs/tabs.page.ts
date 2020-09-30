import { Component, OnInit } from '@angular/core';

import { MenuController } from '@ionic/angular';
import { staticText } from '../../configuration/staticText';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../core/language/language.service';
import { icons, svgIcons } from '../../configuration/icons';
import { roles } from '../../configuration/roles';
import { TabsResolver } from './tabs.resolver';
import { ProfileModel } from '../profile/profile.model';
import { Router } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { MessageService } from '../core/services/message.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: [
    './styles/tabs.page.scss'
  ]
})
export class TabsPage implements OnInit {
  staticText = staticText;
  translations;
  icons = icons;
  svgIcons = svgIcons;
  roles = roles;
  user: ProfileModel;

  constructor(
    public menu: MenuController,
    public translate: TranslateService,
    public languaService: LanguageService,
    public resolver: TabsResolver,
    public router: Router,
    private userService: UserService,
    private messageService: MessageService,
  ) {
  }

  async ngOnInit() {
    this.getTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.getTranslations();
    });
    await this.resolver.resolve().then( (user) => {
      this.user = user;
      this.userService.setUserProfile(user);
    });
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => {
      this.translations = translations;
    });
  }

  ionViewWillEnter() {
    this.menu.enable(true);
  }

  navigateTo(path: string) {
    this.router.navigate([path], { replaceUrl: true });
  }
}
