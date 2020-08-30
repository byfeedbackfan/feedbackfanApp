import { Component, OnInit, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../core/language/language.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserSearchComponent } from './user-search/user-search.component';
import { ModalController, ToastController } from '@ionic/angular';
import { ProfileModel } from '../profile/profile.model';
import { SendMessageModel } from './send-message-model';
import { TabsResolver } from '../tabs/tabs.resolver';
import { MessageService } from '../core/services/message.service';
import { Router } from '@angular/router';

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
  usersSelected: ProfileModel[] = [];
  user: ProfileModel;
  isPublishable: boolean;

  constructor(
    public translate: TranslateService,
    private modalController: ModalController,
    private languageService: LanguageService,
    private tabsResolver: TabsResolver,
    private messageService: MessageService,
    private router: Router,
    private ngZone: NgZone,
    private toastController: ToastController,
  ) {

    this.sendMessageForm = new FormGroup({
      title: new FormControl('', Validators.required),
      info: new FormControl('', Validators.required),
    });

    this.validation_messages = {
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
    await this.tabsResolver.resolve().then((user) => {
      this.user = user;
      this.isPublishable = user.allMessagesPublic;
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

  goToMessagesSendedPage() {
    this.ngZone.run(async () => {
      // Get previous URL from our custom History Helper
      // If there's no previous page, then redirect to profile
      // const previousUrl = this.historyHelper.previousUrl || 'firebase/auth/profile';
      const previousUrl = 'app/sended-message';

      // No need to store in the navigation history the sign-in page with redirect params (it's justa a mandatory mid-step)
      // Navigate to profile and replace current url with profile
      this.router.navigate([previousUrl], { replaceUrl: true });
    });
  }

  async presentSuccessfulMessage() {
    const toast = await this.toastController.create({
      message: this.languageService.getTerm('mensaje_enviado_exitosamente'),
      duration: 2000
    });
    toast.present();
  }

  sendMessage() {
    this.resetSubmitError();
    this.usersSelected.forEach(user => {
      const newMessage: SendMessageModel = new SendMessageModel();
      newMessage.from = this.user.email;
      newMessage.to = user.email;
      newMessage.date = new Date();
      newMessage.title = this.sendMessageForm.get('title').value;
      newMessage.message = this.sendMessageForm.get('info').value;
      newMessage.likes = 0;
      newMessage.dislikes = 0;
      newMessage.isPublishableSender = this.isPublishable;
      newMessage.isPublishableReceiver = false;
      newMessage.isShell = true;
      this.messageService.createSenderMessage(newMessage, this.user.uid).then( () => {
      }).catch(err => {
        this.submitError = err;
      });
    });

    this.usersSelected.forEach(user => {
      const newMessage: SendMessageModel = new SendMessageModel();
      newMessage.from = this.user.email;
      newMessage.to = user.email;
      newMessage.date = new Date();
      newMessage.title = this.sendMessageForm.get('title').value;
      newMessage.message = this.sendMessageForm.get('info').value;
      newMessage.likes = 0;
      newMessage.dislikes = 0;
      newMessage.isPublishableSender = this.isPublishable;
      newMessage.isPublishableReceiver = false;
      newMessage.isShell = true;
      this.messageService.createReceiverMessage(newMessage, user.uid).then( () => {
        this.sendMessageForm.reset();
        this.presentSuccessfulMessage();
        this.goToMessagesSendedPage();
      }).catch(err => {
        this.submitError = err;
      });
    });
  }

  async searchUser() {
    const modal = await this.modalController.create({
      component: UserSearchComponent,
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      this.usersSelected = data.users;
    }
  }

}
