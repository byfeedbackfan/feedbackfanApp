import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '../core/services/message.service';
import { ProfileModel } from '../profile/profile.model';
import { Plugins } from '@capacitor/core';
import * as dayjs from 'dayjs';
import { SendMessageModel } from '../send-message/send-message-model';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { MessageDetailComponent } from '../shared/message-detail/message-detail.component';

const { Storage } = Plugins;

@Component({
  selector: 'app-sended-message',
  templateUrl: './sended-message.page.html',
  styleUrls: [
    './styles/sended-message.page.scss',
    './styles/sended-message.shell.scss'
  ],
})
export class SendedMessagePage implements OnInit {

  sentMessagesStorage: SendMessageModel[] = [];
  userLogged: ProfileModel;
  sentMessages = [];
  translations;
  messageSearch = '';

  constructor(
    public translate: TranslateService,
    public modalController: ModalController,
    private messageService: MessageService,
  ) { }

  async ngOnInit() {
    this.getTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.getTranslations();
    });
    await Storage.get({key: 'userCredentials'}).then(data => {
      this.userLogged = JSON.parse(data.value);
    });
    this.mergeSentMessages();
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe(async (translations) => {
      this.translations = translations;
    });
  }

  async ionViewWillEnter() {
    await Storage.get({key: 'sentMessages'}).then(data => {
      this.sentMessages = JSON.parse(data.value);
    });
  }

  mergeSentMessages() {
    Storage.get({key: 'sentMessages'}).then(data => {
      this.sentMessagesStorage = JSON.parse(data.value);
    });
    this.messageService.getSentMessages(this.userLogged.uid)
    .subscribe(messages => {
      this.sentMessages = messages;
      this.sentMessages.concat(this.sentMessagesStorage);
      this.sentMessages.forEach(element => {
        element.date = dayjs.unix(element.date.seconds).format('DD/MM/YYYY h:m:a');
      });
      const messagesString = JSON.stringify(this.sentMessages);
      Storage.set({key: 'sentMessages', value: messagesString});
    });
  }

  shearchUserInLikesArray(message: SendMessageModel): boolean {
    let userAlreadyLiked = false;
    message.usersLike.forEach( uid => {
      if (this.userLogged.uid === uid) {
        userAlreadyLiked = true;
      }
    });
    return userAlreadyLiked;
  }

  shearchUserDislikesArray(message: SendMessageModel): boolean {
    let userAlreadyUnliked = false;
    message.usersDislike.forEach( uid => {
      if (this.userLogged.uid === uid) {
        userAlreadyUnliked = true;
      }
    });
    return userAlreadyUnliked;
  }

  removeUserInLikesArray(message: SendMessageModel): SendMessageModel {
    message.usersLike.forEach((uid, index) => {
      if (uid === this.userLogged.uid) {
        message.usersLike.splice(index);
      }
    });
    return message;
  }

  removeUserInDislikesArray(message: SendMessageModel): SendMessageModel {
    message.usersDislike.forEach((uid, index) => {
      if (uid === this.userLogged.uid) {
        message.usersDislike.splice(index);
      }
    });
    return message;
  }

  updateStorage() {
    const messages = JSON.stringify(this.sentMessages);
    Storage.set({key: 'sentMessages', value: messages});
  }

  async likeMessage(slidingItem: IonItemSliding, message: SendMessageModel){
    slidingItem.close();
    if (!this.shearchUserInLikesArray(message)) {
      if (this.shearchUserDislikesArray(message)) {
        message = this.removeUserInDislikesArray(message);
        message.dislikes = message.dislikes - 1;
      }
      message.likes = message.likes + 1;
      message.usersLike.push(this.userLogged.uid);
      await this.messageService.updateMessage(message).then(() => {
        this.updateStorage();
      });
    }
  }

  async unlikeMessage(slidingItem: IonItemSliding, message: SendMessageModel) {
    slidingItem.close();
    if (!this.shearchUserDislikesArray(message)) {
      if (this.shearchUserInLikesArray(message)) {
        message = this.removeUserInLikesArray(message);
        message.likes = message.likes - 1;
      }
      message.dislikes = message.dislikes + 1;
      message.usersDislike.push(this.userLogged.uid);
      await this.messageService.updateMessage(message).then(() => {
        this.updateStorage();
      });
    }
  }

  searchMessage(event: any) {
    this.messageSearch = event.detail.value;
  }

  async openMessage(message: SendMessageModel) {
    const messageDetail = await this.modalController.create({
      component: MessageDetailComponent,
      componentProps: {
        messageDetail: message,
        userLogged: this.userLogged,
      }
    });

    await messageDetail.present();
  }

}
