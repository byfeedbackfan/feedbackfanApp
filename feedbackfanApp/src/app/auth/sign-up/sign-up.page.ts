import { Component, OnInit, NgZone } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController, LoadingController } from '@ionic/angular';
import { PasswordValidator } from '../../validators/password.validator';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { UserService } from '../../core/services/user.service';
import { ProfileModel } from '../../profile/profile.model';

import { roles } from '../../../configuration/roles';
import { StorageService } from '../../core/services/storage.service';
import { staticText } from '../../../configuration/staticText';

const { Storage } = Plugins;
const { Camera } = Plugins;

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: [
    './styles/sign-up.page.scss'
  ]
})
export class SignUpPage implements OnInit {
  signupForm: FormGroup;
  // tslint:disable-next-line: variable-name
  matching_passwords_group: FormGroup;
  submitError: string;
  redirectLoader: HTMLIonLoadingElement;
  authRedirectResult: Subscription;

  imageFilePath = '../../../assets/icons/no-profile-picture.jpg';
  imageFile: string;
  staticText = staticText;

  // tslint:disable-next-line: variable-name
  validation_messages = {
    email: [
      { type: 'required', message: this.staticText.validar_correo_requerido },
      { type: 'pattern', message: this.staticText.validar_correo_regular }
    ],
    password: [
      { type: 'required', message: this.staticText.validar_contrasena_requerida },
      { type: 'minlength', message: this.staticText.validar_longitud_contrasena }
    ],
    confirm_password: [
      { type: 'required', message: this.staticText.validar_confirmacion_contrasena }
    ],
    matching_passwords: [
      { type: 'areNotEqual', message: this.staticText.match_contrasena_no_valido }
    ],
    name: [
      { type: 'required', message: this.staticText.validar_nombre }
    ]
  };

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public menu: MenuController,
    public loadingController: LoadingController,
    public location: Location,
    private authService: AuthService,
    private userService: UserService,
    private storageService: StorageService,
    private ngZone: NgZone,
  ) {
    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
      confirm_password: new FormControl('', Validators.required),
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areNotEqual(formGroup);
    });

    this.signupForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      matching_passwords: this.matching_passwords_group,
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
  }

  // Once the auth provider finished the authentication flow, and the auth redirect completes,
  // hide the loader and redirect the user to the profile page
  redirectLoggedUserToProfilePage() {
    // As we are calling the Angular router navigation inside a subscribe method, the navigation will be triggered outside Angular zone.
    // That's why we need to wrap the router navigation call inside an ngZone wrapper
    this.ngZone.run(() => {
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
      message: 'Espere ...'
    });
    await this.redirectLoader.present();
  }

  async dismissLoading() {
    if (this.redirectLoader) {
      await this.redirectLoader.dismiss();
    }
  }

  resetSubmitError() {
    this.submitError = null;
  }

  manageAuthWithProvidersErrors(errorMessage: string) {
    this.submitError = errorMessage;
    // remove auth-redirect param from url
    this.location.replaceState(this.router.url.split('?')[0], '');
    this.dismissLoading();
  }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    }).then((imageData) => {
      this.imageFilePath = imageData.dataUrl;
      this.imageFile = imageData.dataUrl;
    }, (err) => {
      return err;
    });
  }

  signUpWithEmail(): void {
    let indexedData: string;
    const values = this.signupForm.value;
    const userData: ProfileModel = new ProfileModel();
    this.presentLoading();
    this.resetSubmitError();
    this.authService.signUpWithEmail(values)
      .then(async user => {
        userData.uid = user.user.uid;
        userData.email = user.user.email;
        userData.name = values.name;
        userData.role = roles.employee;
        userData.sentMessages = 0;
        userData.receivedMessages = 0;
        userData.isShell = true;
        await this.storageService.uploadUserImg(this.imageFilePath, userData.uid).then (downloadUrl => {
          userData.image = downloadUrl;
          this.userService.createUser(userData);
          indexedData = JSON.stringify(userData);
          Storage.set({key: 'userCredentials', value: indexedData});
        });
        this.dismissLoading();
        this.redirectLoggedUserToProfilePage();
      })
      .catch(error => {
        this.dismissLoading();
        this.submitError = error.message;
      });
  }
}
