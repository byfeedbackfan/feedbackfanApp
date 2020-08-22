import { Component, OnInit, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { HistoryHelperService } from '../../utils/history-helper.service';
import { AuthService } from '../../core/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

import { Plugins } from '@capacitor/core';
import { UserService } from '../../core/services/user.service';

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
  profileData: string;

  // tslint:disable-next-line: variable-name
  validation_messages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ]
  };

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public menu: MenuController,
    public loadingController: LoadingController,
    public location: Location,
    public historyHelper: HistoryHelperService,
    private authService: AuthService,
    private userService: UserService,
    private angularFire: AngularFireAuth,
    private ngZone: NgZone,
  ) {

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

    // Get firebase authentication redirect result invoken when using signInWithRedirect()
    // signInWithRedirect() is only used when client is in web but not desktop
    this.authRedirectResult = this.authService.getRedirectResult()
    .subscribe(result => {
      if (result.user) {
        this.redirectLoggedUserToProfilePage();
      } else if (result.error) {
        this.manageAuthWithProvidersErrors(result.error);
      }
    });

    // Check if url contains our custom 'auth-redirect' param, then show a loader while we receive the getRedirectResult notification
    this.route.queryParams.subscribe(params => {
      const authProvider = params['auth-redirect'];
      if (authProvider) {
        this.presentLoading();
      }
    });
  }

  ngOnInit(): void {
    this.menu.enable(false);
    this.angularFire.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        if (Storage.get({key: 'userCredentials'})) {
          this.redirectLoggedUserToProfilePage();
        }
      }
    });
  }

  // Once the auth provider finished the authentication flow, and the auth redirect completes,
  // hide the loader and redirect the user to the profile page
  redirectLoggedUserToProfilePage() {
    this.dismissLoading();

    // As we are calling the Angular router navigation inside a subscribe method, the navigation will be triggered outside Angular zone.
    // That's why we need to wrap the router navigation call inside an ngZone wrapper
    this.ngZone.run(() => {
      // Get previous URL from our custom History Helper
      // If there's no previous page, then redirect to profile
      // const previousUrl = this.historyHelper.previousUrl || 'firebase/auth/profile';
      const previousUrl = 'auth/profile';

      // No need to store in the navigation history the sign-in page with redirect params (it's justa a mandatory mid-step)
      // Navigate to profile and replace current url with profile
      this.router.navigate([previousUrl], { replaceUrl: true });
    });
  }

  async presentLoading() {
    this.redirectLoader = await this.loadingController.create({
      message: 'Iniciando Sesión...'
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

  getUserData(uid: string) {
    this.userService.getUser(uid).subscribe( userdata => {
      this.profileData = JSON.stringify(userdata);
    });
  }

  signInWithEmail() {
    this.resetSubmitError();
    this.presentLoading();
    this.authService.signInWithEmail(this.loginForm.value.email, this.loginForm.value.password)
    .then(user => {
      this.userService.getUser(user.user.uid).subscribe( userdata => {
        this.profileData = JSON.stringify(userdata);
        Storage.set({key: 'userCredentials', value: this.profileData}).then( () => {
          this.dismissLoading();
          this.redirectLoggedUserToProfilePage();
        });
      });
    })
    .catch(error => {
      this.submitError = error.message;
      this.dismissLoading();
    });
  }
}
