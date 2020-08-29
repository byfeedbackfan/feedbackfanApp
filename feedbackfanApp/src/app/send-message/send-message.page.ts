import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../core/language/language.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserSearchComponent } from './user-search/user-search.component';
import { ModalController } from '@ionic/angular';
import { ProfileModel } from '../profile/profile.model';
import { SendMessageModel } from './send-message-model';
import { TabsResolver } from '../tabs/tabs.resolver';
import { MessageService } from '../core/services/message.service';

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

  sendMessage() {
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
      this.messageService.createSenderMessage(newMessage, this.user.uid).then( res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
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
      this.messageService.createReceiverMessage(newMessage, user.uid).then( res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
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
