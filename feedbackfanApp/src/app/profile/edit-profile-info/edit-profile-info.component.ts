import { Component, OnInit, Input, NgZone } from '@angular/core';
import { ModalController, MenuController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { ProfileModel } from '../profile.model';
import { StorageService } from '../../core/services/storage.service';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { Location } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { staticText } from '../../../configuration/staticText';
import { LanguageService } from '../../core/language/language.service';

const { Storage } = Plugins;
const { Camera } = Plugins;

@Component({
  selector: 'app-edit-profile-info',
  templateUrl: './edit-profile-info.component.html',
  styleUrls: ['./edit-profile-info.component.scss'],
})
export class EditProfileInfoComponent implements OnInit {
  @Input() userCredentials: ProfileModel;

  staticText = staticText;
  updateUserForm: FormGroup;
  // tslint:disable-next-line: variable-name
  matching_passwords_group: FormGroup;
  submitError: string;
  redirectLoader: HTMLIonLoadingElement;
  authRedirectResult: Subscription;
  userData: ProfileModel = new ProfileModel();
  userStorage: ProfileModel;

  imageFilePath = '../../../assets/icons/no-profile-picture.jpg';
  imageFile = '';

  // tslint:disable-next-line: variable-name
  validation_messages;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public menu: MenuController,
    public loadingController: LoadingController,
    public location: Location,
    private languageService: LanguageService,
    private modalController: ModalController,
    private userService: UserService,
    private storageService: StorageService,
    private ngZone: NgZone,
    private authService: AuthService
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

    this.updateUserForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      old_password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
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

    this.validation_messages = {
      email: [
        { type: 'required', message: this.languageService.getTerm('validar_correo_requerido') },
        { type: 'pattern', message: this.languageService.getTerm('validar_correo_regular') }
      ],
      password: [
        { type: 'required', message: this.languageService.getTerm('validar_contrasena_requerida') },
        { type: 'minlength', message: this.languageService.getTerm('validar_longitud_contrasena') }
      ],
      confirm_password: [
        { type: 'required', message: this.languageService.getTerm('validar_confirmacion_contrasena') }
      ],
      matching_passwords: [
        { type: 'areNotEqual', message: this.languageService.getTerm('match_contrasena_no_valido') }
      ],
      name: [
        { type: 'required', message: this.languageService.getTerm('validar_nombre') }
      ]
    };
  }

  ngOnInit() {
    this.imageFilePath = this.userCredentials.image;
    this.updateUserForm.patchValue({
      name: this.userCredentials.name,
      email: this.userCredentials.email,
    });
    this.getUserFromStorage().then(data => {
      this.userStorage = data;
    });
  }

  async getUserFromStorage(): Promise<ProfileModel> {
    let userStorageData: string;

    await Storage.get({key: 'userCredentials'}).then ((data) => {
      userStorageData = data.value;
    });
    return JSON.parse(userStorageData);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  closeModalWithData() {
    this.modalController.dismiss({
      imageUrl: this.userData.image,
      name: this.userData.name
    });
  }

  // -------------------------

  // Once the auth provider finished the authentication flow, and the auth redirect completes,
  // hide the loader and redirect the user to the profile page
  redirectLoggedUserToProfilePage() {
    // As we are calling the Angular router navigation inside a subscribe method, the navigation will be triggered outside Angular zone.
    // That's why we need to wrap the router navigation call inside an ngZone wrapper
    this.ngZone.run(() => {
      // Get previous URL from our custom History Helper
      // If there's no previous page, then redirect to profile
      // const previousUrl = this.historyHelper.previousUrl || 'firebase/auth/profile';
      const previousUrl = 'profile';

      // No need to store in the navigation history the sign-in page with redirect params (it's justa a mandatory mid-step)
      // Navigate to profile and replace current url with profile
      this.router.navigate([previousUrl], { replaceUrl: true });
    });
  }

  async presentLoading() {
    this.redirectLoader = await this.loadingController.create({
      message: this.languageService.getTerm('espere')
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

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 20,
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

  async updateUser(): Promise<void> {
    let indexedData: string;
    const values = this.updateUserForm.value;
    this.resetSubmitError();
    await this.presentLoading();

    this.userData.uid = this.userStorage.uid;
    this.userData.email = this.userStorage.email;
    this.userData.name = values.name;
    this.userData.role = this.userStorage.role;
    this.userData.isShell = true;
    this.userData.allMessagesPublic = this.userStorage.allMessagesPublic;
    this.userData.workersInCharge = this.userStorage.workersInCharge;

    if (values.old_password !== ''
        && values.matching_passwords.password !== ''
        && values.matching_passwords.confirm_password !== '') {
      await this.authService.signInWithEmail(values.email, values.old_password).catch(error => {
        this.submitError = error.message;
      });
      await this.authService.changePassword(values).catch(error => {
        this.submitError = error.message;
      });
    }
    if (this.imageFile !== '') {
      await this.storageService.uploadUserImg(this.imageFilePath, this.userData.uid).then(downloadUrl => {
        this.userData.image = downloadUrl;
      });
    } else {
      this.userData.image = this.userStorage.image;
    }
    await this.userService.updateUser(this.userData).then(async () => {
      indexedData = JSON.stringify(this.userData);
      await Storage.set({key: 'userCredentials', value: indexedData}).then(async () => {
        await this.dismissLoading();
        if (!this.submitError) {
          this.closeModalWithData();
        }
      });
    });
  }

}
