import { Component, OnInit } from '@angular/core';
import { ProfileModel } from '../profile/profile.model';
import { UserService } from '../core/services/user.service';
import { svgIcons, icons } from '../../configuration/icons';
import { SendMessageModel } from '../send-message/send-message-model';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { MessageDetailComponent } from '../shared/message-detail/message-detail.component';
import { MessageService } from '../core/services/message.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


const { Storage } = Plugins;

@Component({
  selector: 'app-user-found',
  templateUrl: './user-found.page.html',
  styleUrls: ['./styles/user-found.page.scss', './styles/user-found.shell.scss'],
})
export class UserFoundPage implements OnInit {
  user: ProfileModel;
  publicMessages = [];
  sendedMessages = [];
  receivedMessages = [];
  svgIcons = svgIcons;
  icons = icons;
  subscriptions: Subscription;

  constructor(
    private userService: UserService,
    private modalController: ModalController,
    private messageService: MessageService,
    private route: ActivatedRoute,
  ) {
    this.user = this.userService.getUserProfile();

  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.user = this.userService.getUserProfile();
    this.publicMessages = [];
    this.receivedMessages = [];
    this.sendedMessages = [];
    this.messageService.getSentMessages(this.user.uid).subscribe(message => {
      message.sort((a, b) => b.date.seconds - a.date.seconds);
      this.sendedMessages = message;
      this.messageService.getReceivedMessages(this.user.uid).subscribe(message2 => {
        message2.sort((a, b) => b.date.seconds - a.date.seconds);
        this.receivedMessages = message2;
        this.mergeReceivedAndSendedMessages(this.receivedMessages, this.sendedMessages);
        this.addSentLikes();
        this.andSentDislikes();
        this.addReceivedLikes();
        this.addReceivedDislikes();
      });
    });
  }

  ionViewWillLeave(): void {
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


  addSentLikes(): number {
    let likes = 0;
    this.sendedMessages?.forEach( element => {
      likes = likes + element.likes;
    });
    return likes;
  }

  andSentDislikes(): number {
    let dislikes = 0;
    this.sendedMessages?.forEach( element => {
      dislikes = dislikes + element.dislikes;
    });
    return dislikes;
  }

  addReceivedLikes(): number {
    let likes = 0;
    this.receivedMessages?.forEach( element => {
      likes = likes + element.likes;
    });
    return likes;
  }

  addReceivedDislikes(): number {
    let dislikes = 0;
    this.receivedMessages?.forEach( element => {
      dislikes = dislikes + element.dislikes;
    });
    return dislikes;
  }

  mergeReceivedAndSendedMessages(receivedMessages, sendedMessages) {
    this.publicMessages = [];
    let Irec = 0;
    let Isend = 0;
    let i = 0;

    while (Irec < receivedMessages?.length && Isend < sendedMessages?.length) {
      if ( receivedMessages[Irec].date.seconds > sendedMessages[Isend].date.seconds ) {
        this.publicMessages[i++] = receivedMessages[Irec++];

      } else if ( receivedMessages[Irec].date.seconds < sendedMessages[Isend].date.seconds ) {
        this.publicMessages[i++] = sendedMessages[Isend++];
      } else if ( receivedMessages[Irec].date.seconds === sendedMessages[Isend].date.seconds ) {
        this.publicMessages[i++] = sendedMessages[Isend++];
        this.publicMessages[i++] = receivedMessages[Irec++];
      }
    }

    while (Irec < receivedMessages?.length) {
      this.publicMessages[i++] = receivedMessages[Irec++];
    }

    while (Isend < sendedMessages?.length) {
      this.publicMessages[i++] = sendedMessages[Isend++];
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
      message.usersDislike.push(this.user.uid);
      await this.messageService.updateMessage(message);
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
