import { Component, OnInit, Input } from '@angular/core';
import { ProfileModel } from '../../profile/profile.model';
import { ModalController, IonItemSliding } from '@ionic/angular';
import { MessageService } from 'src/app/core/services/message.service';
import { svgIcons, icons } from 'src/configuration/icons';
import { MessageDetailComponent } from 'src/app/shared/message-detail/message-detail.component';
import { SendMessageModel } from 'src/app/send-message/send-message-model';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./styles/employee-info.component.scss', './styles/employee-info.shell.scss'],
})
export class EmployeeInfoComponent implements OnInit {

  @Input() user: ProfileModel;

  publicMessages = [];
  sendedMessages = [];
  receivedMessages = [];
  svgIcons = svgIcons;
  icons = icons;
  userLogged: ProfileModel;

  constructor(
    private modalController: ModalController,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    Storage.get({key: 'userCredentials'}).then( user => {
      this.userLogged = JSON.parse(user.value);
      this.publicMessages = [];
      this.messageService.getSentMessages(this.user.uid).subscribe(message => {
        this.sendedMessages = message;
        this.messageService.getReceivedMessages(this.user.uid).subscribe(message2 => {
          this.receivedMessages = message2;
          this.mergeReceivedAndSendedMessages(this.receivedMessages, this.sendedMessages);
          this.addSentLikes();
          this.andSentDislikes();
          this.addReceivedLikes();
          this.addReceivedDislikes();
        });
      });
    });
  }

  ionViewWillEnter() {
  }

  async openMessage(message: SendMessageModel) {
    const messageDetail = await this.modalController.create({
      component: MessageDetailComponent,
      componentProps: {
        messages: this.publicMessages,
        messageDetail: message,
        userLogged: this.userLogged,
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
    const messagesPublic = [];

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

  closeModal() {
    this.modalController.dismiss();
  }

}
