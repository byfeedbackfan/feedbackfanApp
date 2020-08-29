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

  closeModal() {
    this.modalController.dismiss();
  }

}
