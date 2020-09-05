import { Component, OnInit } from '@angular/core';
import { ProfileModel } from './profile.model';

import { Plugins } from '@capacitor/core';
import { ProfileResolver } from './profile.resolver';
import { EditProfileInfoComponent } from './edit-profile-info/edit-profile-info.component';
import { ModalController, PopoverController, IonItemSliding } from '@ionic/angular';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../core/language/language.service';
import { UserOptionsPopoverComponent } from './user-options-popover/user-options-popover.component';
import { MessageService } from '../core/services/message.service';
import { SendMessageModel } from '../send-message/send-message-model';
import { MessageDetailComponent } from '../shared/message-detail/message-detail.component';
import { icons, svgIcons } from '../../configuration/icons'; 

const { Storage } = Plugins;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: [
    './styles/profile.page.scss',
    './styles/profile.shell.scss'
  ]
})
export class ProfilePage implements OnInit {
  user: ProfileModel;
  signupForm: FormGroup;
  isPublicable: boolean;
  // tslint:disable-next-line: variable-name
  matching_passwords_group: FormGroup;
  submitError: string;
  redirectLoader: HTMLIonLoadingElement;
  authRedirectResult: Subscription;

  imageFilePath = '../../../assets/icons/no-profile-picture.jpg';
  imageFile: string;
  translations;
  publicMessages = [];
  icons = icons;
  svgIcons = svgIcons;

  constructor(
    public translate: TranslateService,
    public languageService: LanguageService,
    private profileResolver: ProfileResolver,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private messageService: MessageService,
  ) {}

  async ngOnInit() {
    this.getTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.getTranslations();
    });
    await this.profileResolver.resolve().then((user) => {
      this.user = user;
    }).catch(err => {
      this.submitError = err;
    });

    this.messageService.getReceivedMessages(this.user.uid).subscribe(message => {
      this.publicMessages = message;
    });
  }

  ionViewWillEnter() {
    Storage.get({key: 'userCredentials'}).then(data => {
      this.user = JSON.parse(data.value);
    }).catch(err => {
      this.submitError = err;
    });
    Storage.get({key: 'receivedMessages'}).then( message => {
      if (message) {
        this.publicMessages = JSON.parse(message.value);
      }
    }).catch(err => {
      this.submitError = err;
    });
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => {
      this.translations = translations;
    });
  }

  async presentModal() {

    const modal = await this.modalController.create({
      component: EditProfileInfoComponent,
      componentProps: {
        userCredentials: this.user,
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      this.user.image = data.imageUrl;
      this.user.name = data.name;
    }
  }

  async displayOptionsMenu(ev: any) {
    const popover = await this.popoverController.create({
      component: UserOptionsPopoverComponent,
      componentProps: {user: this.user},
      event: ev,
      mode: 'md',
    });
    return await popover.present();
  }

  async openMessage(message: SendMessageModel) {
    const messageDetail = await this.modalController.create({
      component: MessageDetailComponent,
      componentProps: {
        messages: this.publicMessages,
        messageDetail: message,
        userLogged: this.user,
      }
    });

    await messageDetail.present();

    const { data } = await messageDetail.onDidDismiss();

    if (data) {
      this.publicMessages = data.newMessages;
    }
  }

  shearchUserInLikesArray(message: SendMessageModel): boolean {
    let userAlreadyLiked = false;
    message.usersLike.forEach( uid => {
      if (this.user.uid === uid) {
        userAlreadyLiked = true;
      }
    });
    return userAlreadyLiked;
  }

  shearchUserDislikesArray(message: SendMessageModel): boolean {
    let userAlreadyUnliked = false;
    message.usersDislike.forEach( uid => {
      if (this.user.uid === uid) {
        userAlreadyUnliked = true;
      }
    });
    return userAlreadyUnliked;
  }

  removeUserInLikesArray(message: SendMessageModel): SendMessageModel {
    message.usersLike.forEach((uid, index) => {
      if (uid === this.user.uid) {
        message.usersLike.splice(index);
      }
    });
    return message;
  }

  removeUserInDislikesArray(message: SendMessageModel): SendMessageModel {
    message.usersDislike.forEach((uid, index) => {
      if (uid === this.user.uid) {
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
      message.usersLike.push(this.user.uid);
      await this.messageService.updateMessage(message);
      this.setUpdateMessageToStorage(message);
    }
  }

  async setUpdateMessageToStorage(message: SendMessageModel) {
    let receivedMsg: SendMessageModel[];
    await Storage.get({key: 'receivedMessages'}).then( messages => {
      receivedMsg = JSON.parse(messages.value);
    });
    receivedMsg.forEach((element, i) => {
      if (element.id === message.id) {
        receivedMsg.splice(i, 1, message);
      }
    });
    const receivedMsgStr = JSON.stringify(receivedMsg);
    Storage.set({key: 'receivedMessages', value: receivedMsgStr});
  }

  async unlikeMessage(slidingItem: IonItemSliding, message: SendMessageModel) {
    slidingItem.close();
    if (!this.shearchUserDislikesArray(message)) {
      if (this.shearchUserInLikesArray(message)) {
        message = this.removeUserInLikesArray(message);
        message.likes = message.likes - 1;
      }
      message.dislikes = message.dislikes + 1;
      message.usersDislike.push(this.user.uid);
      await this.messageService.updateMessage(message);
      this.setUpdateMessageToStorage(message);
    }
  }

  checkifLiked(message: SendMessageModel): boolean {
    let isLiked: boolean;
    message.usersLike.forEach(user => {
      if (user === this.user.uid) {
        isLiked = true;
      }
    });
    return isLiked;
  }

  checkifDisliked(message: SendMessageModel): boolean {
    let isDisliked: boolean;
    message.usersDislike.forEach(user => {
      if (user === this.user.uid) {
        isDisliked = true;
      }
    });
    return isDisliked;
  }
}
