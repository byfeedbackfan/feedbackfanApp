import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { ProfileModel } from '../../profile/profile.model';
import { ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';


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

  constructor(
    private userService: UserService,
    private modalController: ModalController,
  ) {
    Storage.get({key: 'userCredentials'}).then( user => {
      this.userStorage = JSON.parse(user.value);
      this.userService.getUsers(this.userStorage.uid).subscribe( users => {
        this.deleteUserLoggedFromArray(users);
      });
    } );
  }

  deleteUserLoggedFromArray(users: ProfileModel[]) {
    users.forEach( userr => {
      if (userr.uid !== this.userStorage.uid ) {
        this.usersData.push(userr);
      }
    });
  }

  async ngOnInit() {
  }

  searchUser() {
  }

  closeModalWithData() {
    this.modalController.dismiss({
      users: this.usersToSendMessage
    });
  }

  pressed(user: ProfileModel) {
    this.isClicked = !this.isClicked;
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
    console.log(user);
    const arraySearch = this.searchIfUserExistsInArray(user);
    if ( arraySearch[0] ) {
      console.log(' esta');
      this.usersToSendMessage.splice(arraySearch[1]);
    } else {
      console.log(' no esta');
      this.usersToSendMessage.push(user);
    }
    console.log(this.usersToSendMessage);
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
