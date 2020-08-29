import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../core/language/language.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserSearchComponent } from './user-search/user-search.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.page.html',
  styleUrls: [
    './styles/send-message.page.scss',
    './styles/send-message.shell.scss'
  ],
})
export class SendMessagePage implements OnInit {

  sendMessageForm: FormGroup;
  // tslint:disable-next-line: variable-name
  validation_messages;
  translations;
  submitError: string;

  constructor(
    public translate: TranslateService,
    private modalController: ModalController,
    private languageService: LanguageService,
  ) {

    this.sendMessageForm = new FormGroup({
      user: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      info: new FormControl('', Validators.required),
    });

    this.validation_messages = {
      user: [
        { type: 'required', message: this.languageService.getTerm('validar_mensaje_usuarios') },
      ],
      title: [
        { type: 'required', message: this.languageService.getTerm('validar_contrasena_requerida') },
      ],
      info: [
        { type: 'required', message: 'El mensaje no puede estar vacío' },
      ]
    };
  }

  async ngOnInit() {
    this.getTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.getTranslations();
    });
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe(async (translations) => {
      this.translations = translations;
    });
  }

  resetSubmitError() {
    this.submitError = null;
  }

  sendMessage() {
    console.log(this.sendMessageForm.get('info').value);
  }

  async searchUser() {
    const modal = await this.modalController.create({
      component: UserSearchComponent,
    });
    return await modal.present();
  }

}
