import { Component, OnInit, NgZone, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController, LoadingController } from '@ionic/angular';
import { Subscription, Observable } from 'rxjs';

import { HistoryHelperService } from '../../utils/history-helper.service';
import { AuthService } from '../../core/services/auth.service';

import { Plugins } from '@capacitor/core';
import { UserService } from '../../core/services/user.service';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/core/language/language.service';

const { Storage } = Plugins;

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: [
    './styles/sign-in.page.scss'
  ]
})
export class SignInPage implements OnInit {
  loginForm: FormGroup;
  submitError: string;
  redirectLoader: HTMLIonLoadingElement;
  authRedirectResult: Subscription;
  translations;

  @Output() userLogged: boolean;

  // tslint:disable-next-line: variable-name
  validation_messages;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public menu: MenuController,
    public loadingController: LoadingController,
    public location: Location,
    public historyHelper: HistoryHelperService,
    public translate: TranslateService,
    public languageService: LanguageService,
    private authService: AuthService,
    private userService: UserService,
    private ngZone: NgZone,
  ) {

    this.menu.enable(false);

    this.validation_messages = {
      email: [
        { type: 'required', message: this.languageService.getTerm('validar_correo_requerido') },
        { type: 'pattern', message: this.languageService.getTerm('validar_correo_regular') }
      ],
      password: [
        { type: 'required', message: this.languageService.getTerm('validar_contrasena_requerida') },
        { type: 'minlength', message: this.languageService.getTerm('validar_longitud_contrasena') }
      ]
    };

    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ]))
    });
  }

  ngOnInit(): void {
    this.menu.enable(false);

    this.getTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.getTranslations();
    });

    Storage.get({key: 'userCredentials'}).then((data) => {
      if (data.value) {
        this.redirectLoggedUserToProfilePage();
      }
    });
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => {
      this.translations = translations;
    });
  }

  // Once the auth provider finished the authentication flow, and the auth redirect completes,
  // hide the loader and redirect the user to the profile page
  redirectLoggedUserToProfilePage() {
    // As we are calling the Angular router navigation inside a subscribe method, the navigation will be triggered outside Angular zone.
    // That's why we need to wrap the router navigation call inside an ngZone wrapper
    this.ngZone.run(async () => {
      // Get previous URL from our custom History Helper
      // If there's no previous page, then redirect to profile
      // const previousUrl = this.historyHelper.previousUrl || 'firebase/auth/profile';
      const previousUrl = 'app/profile';

      // No need to store in the navigation history the sign-in page with redirect params (it's justa a mandatory mid-step)
      // Navigate to profile and replace current url with profile
      this.router.navigate([previousUrl], { replaceUrl: true });
    });
  }

  async presentLoading() {
    this.redirectLoader = await this.loadingController.create({
      message: this.languageService.getTerm('iniciando_sesion')
    });
    await this.redirectLoader.present();
  }

  async dismissLoading() {
    if (this.redirectLoader) {
      await this.redirectLoader.dismiss();
    }
  }

  manageAuthWithProvidersErrors(errorMessage: string) {
    this.submitError = errorMessage;
    // remove auth-redirect param from url
    this.location.replaceState(this.router.url.split('?')[0], '');
    this.dismissLoading();
  }

  resetSubmitError() {
    this.submitError = null;
  }

  async signInWithEmail() {
    this.resetSubmitError();
    await this.presentLoading();
    let profileData: string;
    this.authService.signInWithEmail(this.loginForm.value.email, this.loginForm.value.password)
    .then(user => {
      // navigate to user profile
      this.userService.getUser(user.user.uid).subscribe((userdata) => {
        profileData = JSON.stringify(userdata);
        this.userLogged = true;
        Storage.set({key: 'userCredentials', value: profileData});
        this.redirectLoggedUserToProfilePage();
      });
    })
    .catch(error => {
      this.submitError = error.message;
    }).finally(async () => {
      await this.dismissLoading();
    });
  }
}
