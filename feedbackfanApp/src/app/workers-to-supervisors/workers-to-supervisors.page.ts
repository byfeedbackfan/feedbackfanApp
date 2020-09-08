import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { ProfileModel } from '../profile/profile.model';
import { icons } from 'src/configuration/icons';
import { roles } from 'src/configuration/roles';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AsignWorkerComponent } from './asign-worker/asign-worker.component';

@Component({
  selector: 'app-workers-to-supervisors',
  templateUrl: './workers-to-supervisors.page.html',
  styleUrls: ['./styles/workers-to-supervisors.page.scss'],
})
export class WorkersToSupervisorsPage implements OnInit {

  userSearch = '';
  users: ProfileModel[] = [];
  supervisors: ProfileModel[] = [];
  icons = icons;
  roles = roles;

  constructor(
    private userService: UserService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.getSupervisorsOfUsers();
    });
  }

  searchUser(event) {
    this.userSearch = event.detail.value;
  }

  getSupervisorsOfUsers() {
    this.users.forEach( user => {
      if (user.role === roles.supervisor) {
        this.supervisors.push(user);
      }
    });
  }

  async goToSetWorkers(user: ProfileModel) {
    const modal = await this.modalController.create({
      component: AsignWorkerComponent,
      componentProps: {
        supervisor: user,
        users: this.users,
      }
    });
    await modal.present();
  }
}
