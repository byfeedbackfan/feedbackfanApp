import { Component, OnInit } from '@angular/core';
import { icons, svgIcons } from 'src/configuration/icons';
import { ProfileModel } from '../profile/profile.model';
import { Plugins } from '@capacitor/core';
import { UserService } from '../core/services/user.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { EmployeeInfoComponent } from './employee-info/employee-info.component';

const { Storage } = Plugins;

@Component({
  selector: 'app-employees-in-charge',
  templateUrl: './employees-in-charge.page.html',
  styleUrls: ['./styles/employees-in-charge.page.scss'],
})
export class EmployeesInChargePage implements OnInit {

  userSearch = '';
  icons = icons;
  svgIcons = svgIcons;
  userLogged: ProfileModel;
  users: ProfileModel[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private modalController: ModalController,
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
    this.users.forEach( (user, index) => {
      let InWorkers = false;
      this.userLogged.workersInCharge.forEach((uid) => {
        if (uid === user.uid) {
          InWorkers = true;
        }
      });
      if (!InWorkers) {
        this.users.splice(index, 1);
      }
    });
  }

  async goToProfileWithAllMessages(userWorker: ProfileModel) {
    const modal = await this.modalController.create({
      component: EmployeeInfoComponent,
      componentProps: {
        user: userWorker,
      }
    });

    await modal.present();
  }
}
