import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { ProfileModel } from '../../profile/profile.model';
import { ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { icons } from '../../../configuration/icons';


const { Storage } = Plugins;

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: [
    './user-search.component.scss',
    '../styles/send-message.shell.scss'
  ],
})
export class UserSearchComponent implements OnInit {
  usersData: ProfileModel[] = [];
  userStorage: ProfileModel;
  isClicked: boolean;
  usersToSendMessage: ProfileModel[] = [];
  changeColor = false;
  userSearch = '';
  users = [];
  icons = icons;

  constructor(
    private userService: UserService,
    private modalController: ModalController,
  ) {
    Storage.get({key: 'userCredentials'}).then( user => {
      this.userStorage = JSON.parse(user.value);
      this.userService.getUsers().subscribe( users => {
        this.deleteUserLoggedFromArray(users);
      });
    } );
  }

  deleteUserLoggedFromArray(users: ProfileModel[]) {
    users.forEach( userr => {
      if (userr.uid !== this.userStorage.uid ) {
        const user = {
          uid: userr.uid,
          email: userr.email,
          name: userr.name,
          role: userr.role,
          image: userr.image,
          allMessagesPublic: userr.allMessagesPublic,
          isShell: userr.isShell,
          isSelected: false,
        };
        this.users.push(user);
      }
    });
  }

  async ngOnInit() {
  }

  searchUser( event ) {
    this.userSearch = event.detail.value;
  }

  closeModalWithData() {
    this.modalController.dismiss({
      users: this.usersToSendMessage
    });
  }

  pressed( user ) {
    if (user.isSelected === true) {
      user.isSelected = false;
      this.usersToSendMessage.forEach((userStored, index) => {
        if (userStored.uid === user.uid) {
          this.usersToSendMessage.splice(index, 1);
        }
      });
    } else {
      user.isSelected = true;
      this.usersToSendMessage.push(user);
    }
    console.log(this.usersToSendMessage);
  }

  searchIfUserExistsInArray(user: ProfileModel) {
    let isAdded = false;
    this.usersToSendMessage.forEach((userStored, index) => {
      if (userStored.uid === user.uid){
        isAdded = true;
        this.usersToSendMessage.splice(index);
      }
    });
    if (!isAdded) {
      this.usersToSendMessage.push(user);
      console.log(this.usersToSendMessage);
    }

  }

  setUserIntoArray(user: ProfileModel) {
    this.searchIfUserExistsInArray(user);
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
