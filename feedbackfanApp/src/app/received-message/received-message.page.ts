import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, IonItemSliding, LoadingController } from '@ionic/angular';
import { MessageService } from '../core/services/message.service';
import { Plugins } from '@capacitor/core';
import { SendMessageModel } from '../send-message/send-message-model';
import { ProfileModel } from '../profile/profile.model';
import { MessageDetailComponent } from '../shared/message-detail/message-detail.component';
import { icons, svgIcons } from '../../configuration/icons';
import { LanguageService } from '../core/language/language.service';
import { of } from 'rxjs';

const { Storage } = Plugins;

@Component({
  selector: 'app-received-message',
  templateUrl: './received-message.page.html',
  styleUrls: [
    './styles/received-message.page.scss',
    './styles/received-message.shell.scss'
  ],
})
export class ReceivedMessagePage implements OnInit {

  receivedMessagesStorage: SendMessageModel[] = [];
  userLogged: ProfileModel;
  receivedMessages = [];
  isLiked: boolean;
  translations;
  messageSearch = '';
  icons = icons;
  svgIcons = svgIcons;
  loader: HTMLIonLoadingElement;

  constructor(
    public translate: TranslateService,
    public modalController: ModalController,
    public languageService: LanguageService,
    private messageService: MessageService,
    private loadingController: LoadingController,
  ) {
  }

  async ngOnInit() {
    this.presentLoading();
    this.getTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.getTranslations();
    });
    await Storage.get({key: 'userCredentials'}).then(data => {
      this.userLogged = JSON.parse(data.value);
      this.getReceivedMessages();
    });
  }

  getReceivedMessages() {
    this.messageService.getReceivedMessagesSnapshot(this.userLogged.uid).subscribe(receivedMessages => {
      receivedMessages.sort((a, b) => b.date.seconds - a.date.seconds);
      this.messageService.setReceivedMessagesGlobal(receivedMessages);
      this.getSentMessages();
    });
  }

  getSentMessages() {
    this.messageService.getSentMessages(this.userLogged.uid).subscribe(sentMessages => {
      sentMessages.sort((a, b) => b.date.seconds - a.date.seconds);
      this.messageService.setSentMessagesGlobal(sentMessages);
      this.receivedMessages = this.messageService.getReceivedMessagesGlobal();
      this.loader.dismiss();
    });
  }

  ionViewWillEnter() {
    this.receivedMessages = this.messageService.getReceivedMessagesGlobal();
  }

  checkifLiked(message: SendMessageModel): boolean {
    let isLiked: boolean;
    message.usersLike.forEach(user => {
      if (user === this.userLogged.uid) {
        isLiked = true;
      }
    });
    return isLiked;
  }

  async presentLoading() {
    this.loader = await this.loadingController.create({});
    await this.loader.present();
  }

  checkifDisliked(message: SendMessageModel): boolean {
    let isDisliked: boolean;
    message.usersDislike.forEach(user => {
      if (user === this.userLogged.uid) {
        isDisliked = true;
      }
    });
    return isDisliked;
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe(async (translations) => {
      this.translations = translations;
    });
  }

  searchMessage(event: any) {
    this.messageSearch = event.detail.value;
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

  async likeMessage(slidingItem: IonItemSliding, message: SendMessageModel){
    slidingItem.close();
    if (!this.shearchUserInLikesArray(message)) {
      if (this.shearchUserDislikesArray(message)) {
        message = this.removeUserInDislikesArray(message);
        message.dislikes = message.dislikes - 1;
      }
      message.likes = message.likes + 1;
      message.usersLike.push(this.userLogged.uid);
      await this.messageService.updateMessage(message);
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
      await this.messageService.updateMessage(message);
    }
  }

  async updateMessage(message: SendMessageModel) {
    if (message.readed === false) {
      let index;
      this.receivedMessages.forEach((elem, i) => {
        if (elem.id === message.id) {
          index = i;
          this.receivedMessages[i].readed = true;
        }
      });
      await this.messageService.updateMessage(this.receivedMessages[index]);
    }
  }

  async openMessage(message: SendMessageModel) {
    this.updateMessage(message);
    const messageDetail = await this.modalController.create({
      component: MessageDetailComponent,
      componentProps: {
        messages: this.receivedMessages,
        messageDetail: message,
        userLogged: this.userLogged,
      }
    });

    await messageDetail.present();

    const { data } = await messageDetail.onDidDismiss();

    if (data) {
      this.receivedMessages = data.newMessages;
    }
  }
}
