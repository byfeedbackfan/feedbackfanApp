import { Component, OnInit } from '@angular/core';

import { MenuController } from '@ionic/angular';
import { staticText } from '../../configuration/staticText';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../core/language/language.service';

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

  constructor(
    public menu: MenuController,
    public translate: TranslateService,
    public languaService: LanguageService,
  ) { }

  ngOnInit() {
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

  ionViewWillEnter() {
    this.menu.enable(true);
  }
}
