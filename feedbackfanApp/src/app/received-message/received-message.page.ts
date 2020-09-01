import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, IonItemSliding } from '@ionic/angular';
import { MessageService } from '../core/services/message.service';
import { Plugins } from '@capacitor/core';
import * as dayjs from 'dayjs';
import { SendMessageModel } from '../send-message/send-message-model';
import { ProfileModel } from '../profile/profile.model';
import { MessageDetailComponent } from '../shared/message-detail/message-detail.component';

const { Storage } = Plugins;

@Component({
  selector: 'app-received-message',
  templateUrl: './received-message.page.html',
  styleUrls: ['./styles/received-message.page.scss'],
})
export class ReceivedMessagePage implements OnInit {

  receivedMessagesStorage: SendMessageModel[] = [];
  userLogged: ProfileModel;
  receivedMessages = [];
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
  }

  async ionViewWillEnter() {
    
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
