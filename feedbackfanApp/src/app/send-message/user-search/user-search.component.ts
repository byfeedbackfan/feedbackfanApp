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
    user.isSelected = !user.isSelected;
    this.changeColor = true;
    this.setUserIntoArray(user);
  }

  searchIfUserExistsInArray(user: ProfileModel): Array<any> {
    let isAdded: boolean;
    let position: number;
    this.usersToSendMessage.forEach((userStored, index) => {
      if (userStored.uid === user.uid){
        isAdded = true;
        position = index;
      }
    });
    if (isAdded) {
      return [isAdded, position];
    } else {
      return [false];
    }
  }

  setUserIntoArray(user: ProfileModel) {
    const arraySearch = this.searchIfUserExistsInArray(user);
    if ( arraySearch[0] ) {
      this.usersToSendMessage.splice(arraySearch[1]);
    } else {
      this.usersToSendMessage.push(user);
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
