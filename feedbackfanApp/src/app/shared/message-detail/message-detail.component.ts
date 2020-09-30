import { Component, OnInit, Input } from '@angular/core';
import { SendMessageModel } from '../../send-message/send-message-model';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { ProfileModel } from '../../profile/profile.model';
import { MessageService } from '../../core/services/message.service';
import { icons } from '../../../configuration/icons';
import { Plugins } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

const { Storage } = Plugins;

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.scss'],
})
export class MessageDetailComponent implements OnInit {

  @Input() messageDetail;
  @Input() userLogged: ProfileModel;
  @Input() messages: SendMessageModel[];
  @Input() index: number;

  translations;
  icons = icons;
  subscriptions: Subscription;

  constructor(
    public translate: TranslateService,
    public modalController: ModalController,
    public messageService: MessageService,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.subscriptions = this.route.data.subscribe();
    this.getTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.getTranslations();
    });
  }

  ionViewWillLeave(): void {
    // console.log('TravelListingPage [ionViewWillLeave]');
    this.subscriptions.unsubscribe();
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe(async (translations) => {
      this.translations = translations;
    });
  }

  closeModal() {
    this.modalController.dismiss({
      newMessages: this.messages
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

  changePublishableMessage() {
    this.messageDetail.isPublishableReceiver = !this.messageDetail.isPublishableReceiver;
    this.messageService.updateMessage(this.messageDetail);
    this.setUpdateMessage(this.messageDetail);
  }

  setUpdateMessage(message: SendMessageModel) {
    this.messages.forEach((element, i) => {
      if (element.id === message.id) {
        this.messages.splice(i, 1, message);
      }
    });
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

  checkifDisliked(message: SendMessageModel): boolean {
    let isDisliked: boolean;
    message.usersDislike.forEach(user => {
      if (user === this.userLogged.uid) {
        isDisliked = true;
      }
    });
    return isDisliked;
  }

}
