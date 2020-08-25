import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRouteSnapshot, Route, ActivatedRoute } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./styles/reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit{

  forgotPasswordForm: FormGroup;
  oobCode: string;

  // tslint:disable-next-line: variable-name
  validation_messages = {
    password: [
      { type: 'required', message: 'Debes agregar una contraseña.' },
      { type: 'minlength', message:  'La contraseña debe tener mínimo 6 caracteres.' }
    ]
  };

  constructor(
    public router: Router,
    public menu: MenuController,
    private toastController: ToastController,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.forgotPasswordForm = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ]))
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.oobCode = params.oobCode;
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'La contraseña se ha guardado satisfactoriamente',
      duration: 2000
    });
    toast.present();
  }

  setNewPassword(): void {
    const password = this.forgotPasswordForm.value;
    this.authService.changeForgottenPassword(this.oobCode, password.password)
    .then(() => {
      this.presentToast();
      this.router.navigate(['auth/sign-in'], { replaceUrl: true });
    });
  }

}
