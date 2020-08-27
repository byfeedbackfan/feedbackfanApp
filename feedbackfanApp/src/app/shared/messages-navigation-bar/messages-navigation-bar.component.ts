import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/core/language/language.service';

const { Storage } = Plugins;

@Component({
  selector: 'app-messages-navigation-bar',
  templateUrl: './messages-navigation-bar.component.html',
  styleUrls: ['./messages-navigation-bar.component.scss'],
})
export class MessagesNavigationBarComponent implements OnInit {

  translations;

  constructor(
    public translate: TranslateService,
    public languageService: LanguageService,
    private authService: AuthService,
    private router: Router,
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

  signOut() {
    this.authService.signOut().subscribe(() => {
      Storage.clear();
      this.router.navigate(['auth/sign-in'], { replaceUrl: true });
    }, (error) => {
      console.log('signout error', error);
    });
  }

}
