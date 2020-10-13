import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from 'src/app/core/language/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: [
    './styles/forgot-password.page.scss'
  ]
})
export class ForgotPasswordPage implements OnInit {
  forgotPasswordForm: FormGroup;
  translations;

  // tslint:disable-next-line: variable-name
  validation_messages;

  constructor(
    public router: Router,
    public menu: MenuController,
    public translate: TranslateService,
    private toastController: ToastController,
    private authService: AuthService,
    private languageService: LanguageService,
  ) {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });

    this.validation_messages = {
      email: [
        { type: 'required', message: this.languageService.getTerm('validar_correo_requerido') },
        { type: 'pattern', message: this.languageService.getTerm('validar_correo_regular') }
      ]
    };
  }

  ngOnInit() {
    this.getTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.getTranslations();
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'El correo se ha enviado satisfactoriamente.',
      duration: 2000
    });
    toast.present();
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => {
      this.translations = translations;
    });
  }

  recoverPassword(): void {
    const email = this.forgotPasswordForm.value;
    this.authService.resetPassword(email.email).then(res => {
      this.presentToast().then( () => {
        this.router.navigate(['auth/sign-in'], { replaceUrl: true });
      });
    });
  }

}
