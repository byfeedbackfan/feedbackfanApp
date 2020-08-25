import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: [
    './styles/forgot-password.page.scss'
  ]
})
export class ForgotPasswordPage {
  forgotPasswordForm: FormGroup;

  // tslint:disable-next-line: variable-name
  validation_messages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ]
  };

  constructor(
    public router: Router,
    public menu: MenuController,
    private toastController: ToastController,
    private authService: AuthService,
  ) {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('ejemplo@dominio.com', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'El correo se ha enviado satisfactoriamente.',
      duration: 2000
    });
    toast.present();
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
