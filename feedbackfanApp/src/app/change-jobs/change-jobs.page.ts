import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { ProfileModel } from '../profile/profile.model';
import { icons } from 'src/configuration/icons';
import { svgIcons } from '../../configuration/icons';
import { roles } from '../../configuration/roles';
import { Plugins } from '@capacitor/core';
import { IonItemSliding } from '@ionic/angular';

const { Storage } = Plugins;

@Component({
  selector: 'app-change-jobs',
  templateUrl: './change-jobs.page.html',
  styleUrls: ['./styles/change-jobs.page.scss'],
})
export class ChangeJobsPage implements OnInit {

  users: ProfileModel[] = [];
  userSearch = '';
  icons = icons;
  svgIcons = svgIcons;
  roles = roles;
  userLogged: ProfileModel;

  constructor(
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    Storage.get({key: 'userCredentials'}).then( user => {
      this.userLogged = JSON.parse(user.value);
      this.userService.getUsers().subscribe(users => {
        this.users = users;
        this.deleteUserLoggedFromArray();
      });
    } );
  }

  searchUser( event ) {
    this.userSearch = event.detail.value;
  }

  deleteUserLoggedFromArray() {
    this.users.forEach( (user, index) => {
      if (user.uid === this.userLogged.uid ) {
        this.users.splice(index, 1);
      }
    });
  }

  changeJob(slidingItem: IonItemSliding, user: ProfileModel, role: string) {
    slidingItem.close();
    if (user.role !== role) {
      user.role = role;
      if (user.role === roles.employee) {
        user.workersInCharge = [];
      }
      this.userService.updateUser(user);

      if (role === roles.employee) {
        this.users.forEach(element => {
          element.workersInCharge.forEach((workerId, index) => {
            if (workerId === user.uid) {
              element.workersInCharge.splice(index, 1);
              this.userService.updateUser(element);
            }
          });
        });
      }
    }


  }

}
