import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { icons, svgIcons } from '../../configuration/icons';
import { ProfileModel } from '../profile/profile.model';
import { SendMessageModel } from '../send-message/send-message-model';
import { MessageService } from '../core/services/message.service';
import { UserService } from '../core/services/user.service';
import { UserRankingModel } from './user-ranking.model';
import { Router } from '@angular/router';

const { Storage } = Plugins;

@Component({
  selector: 'app-user-ranking',
  templateUrl: './user-ranking.page.html',
  styleUrls: ['./styles/user-ranking.page.scss'],
})
export class UserRankingPage implements OnInit {

  icons = icons;
  svgIcons = svgIcons;
  userLogged: ProfileModel;
  usersRanking: UserRankingModel[] = [];
  usersToRanking;
  allUsers: ProfileModel[] = [];
  allMessages: SendMessageModel[] = [];

  sortList = [
    {
      prop: 'enviados',
      dir: 'desc'
    },
    {
      prop: 'recibidos',
      dir: 'desc'
    },
    {
      prop: 'elikes',
      dir: 'desc'
    },
    {
      prop: 'rlikes',
      dir: 'desc'
    },
    {
      prop: 'rdislikes',
      dir: 'asc'
    },
    {
      prop: 'edislikes',
      dir: 'asc'
    },
  ];

  rows = [
    { usuario: 'Austin', enviados: 100500000, elikes: 400500000, edislikes: 300500000, recibidos: 100500000, rlikes: 400500000, rdislikes: 100500000},
    { usuario: 'Austin', enviados: 10, elikes: 5, edislikes: 5, recibidos: 10, rlikes: 5, rdislikes: 5},
    { usuario: 'Austin', enviados: 10, elikes: 5, edislikes: 5, recibidos: 10, rlikes: 5, rdislikes: 5},
    { usuario: 'Austin', enviados: 100500000, elikes: 400500000, edislikes: 300500000, recibidos: 100500000, rlikes: 400500000, rdislikes: 100500000},
    { usuario: 'Austin', enviados: 10, elikes: 5, edislikes: 5, recibidos: 10, rlikes: 5, rdislikes: 5},
    { usuario: 'Austin', enviados: 10, elikes: 5, edislikes: 5, recibidos: 10, rlikes: 5, rdislikes: 5},
    { usuario: 'Austin', enviados: 10, elikes: 5, edislikes: 5, recibidos: 10, rlikes: 5, rdislikes: 5},
    { usuario: 'Austin', enviados: 10, elikes: 5, edislikes: 5, recibidos: 10, rlikes: 5, rdislikes: 5},
    { usuario: 'Austin', enviados: 10, elikes: 5, edislikes: 5, recibidos: 10, rlikes: 5, rdislikes: 5},
    { usuario: 'Austin', enviados: 10, elikes: 5, edislikes: 5, recibidos: 10, rlikes: 5, rdislikes: 5},
    { usuario: 'Austin', enviados: 10, elikes: 5, edislikes: 5, recibidos: 10, rlikes: 5, rdislikes: 5},
    { usuario: 'Austin', enviados: 10, elikes: 5, edislikes: 5, recibidos: 10, rlikes: 5, rdislikes: 5},
  ];

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    Storage.get({key: 'userCredentials'}).then(user => {
      this.userLogged = JSON.parse(user.value);
      this.rows.forEach(row => {
        row.usuario = this.userLogged.image;
      });
    });
    this.messageService.getMessages().subscribe(messages => {
      this.allMessages = messages;
    });
    this.userService.getUsers().subscribe(users => {
      this.allUsers = users;
      this.setUserRanking();
      console.log(this.usersRanking);
    });
    console.log(this.usersRanking);
  }

  goToProfile(event) {
    let userProfile: ProfileModel;
    this.allUsers.forEach(user => {
      if (user.uid === event.row.uid) {
        userProfile = user;
      }
    });
    this.userService.setUserProfile(userProfile);
    this.router.navigate(['app/user'], { replaceUrl: true });
  }

  setUserRanking() {
    this.usersRanking = [];
    this.allUsers.forEach(user => {
      const userRanking = new UserRankingModel();
      userRanking.uid = user.uid;
      userRanking.image = user.image;
      userRanking.isShell = true;
      userRanking.receivedMessages = user.receivedMessages;
      userRanking.sentMessages = user.sentMessages;
      userRanking.receivedMessagesLikes = 0;
      userRanking.receivedMessagesDislikes = 0;
      userRanking.sentMessagesLikes = 0;
      userRanking.sentMessagesDislikes = 0;

      this.allMessages.forEach(message => {
        if (message.uidReceiver === userRanking.uid) {
          userRanking.receivedMessagesLikes = userRanking.receivedMessagesLikes + message.likes;
          userRanking.receivedMessagesDislikes = userRanking.receivedMessagesLikes + message.dislikes;
        }
        if (message.uidSender === userRanking.uid) {
          userRanking.receivedMessagesLikes = userRanking.receivedMessagesLikes + message.likes;
          userRanking.receivedMessagesDislikes = userRanking.receivedMessagesLikes + message.dislikes;
        }
      });
      this.usersRanking.push(userRanking);
    });
  }

}
