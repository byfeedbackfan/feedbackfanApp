import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { icons, svgIcons } from '../../configuration/icons';
import { ProfileModel } from '../profile/profile.model';
import { SendMessageModel } from '../send-message/send-message-model';
import { MessageService } from '../core/services/message.service';
import { UserService } from '../core/services/user.service';
import { UserRankingModel } from './user-ranking.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

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
  subscriptions: Subscription;

  sortList = [
    {
      prop: 'sentMessages',
      dir: 'desc'
    },
    {
      prop: 'receivedMessages',
      dir: 'desc'
    },
    {
      prop: 'sentMessagesLikes',
      dir: 'desc'
    },
    {
      prop: 'receivedMessagesLikes',
      dir: 'desc'
    },
    {
      prop: 'receivedMessagesDislikes',
      dir: 'asc'
    },
    {
      prop: 'sentMessagesDislikes',
      dir: 'asc'
    },
  ];

  myMessages = {
    emptyMessage: ' ',
    totalMessage: 'Usuarios'
  };

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.subscriptions = this.route.data.subscribe();
    Storage.get({key: 'userCredentials'}).then(user => {
      this.userLogged = JSON.parse(user.value);
    });
    this.messageService.getMessages().subscribe(messages => {
      this.allMessages = messages;
      this.userService.getUsers().subscribe(users => {
        this.allUsers = users;
        this.setUserRanking();
      });
    });

  }

  ionViewWillLeave(): void {
    // console.log('TravelListingPage [ionViewWillLeave]');
    this.subscriptions.unsubscribe();
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
      userRanking.receivedMessages = 0;
      userRanking.receivedMessagesLikes = 0;
      userRanking.receivedMessagesDislikes = 0;
      userRanking.sentMessages = 0;
      userRanking.sentMessagesLikes = 0;
      userRanking.sentMessagesDislikes = 0;

      this.allMessages.forEach(message => {
        if (message.uidReceiver === user.uid) {
          userRanking.receivedMessages = userRanking.receivedMessages + 1;
          userRanking.receivedMessagesLikes = userRanking.receivedMessagesLikes + message.likes;
          userRanking.receivedMessagesDislikes = userRanking.receivedMessagesDislikes + message.dislikes;
        }
        if (message.uidSender === user.uid) {
          userRanking.sentMessages = userRanking.sentMessages + 1;
          userRanking.sentMessagesLikes = userRanking.sentMessagesLikes + message.likes;
          userRanking.sentMessagesDislikes = userRanking.sentMessagesDislikes + message.dislikes;
        }
      });
      this.usersRanking.push(userRanking);
    });
  }

}
