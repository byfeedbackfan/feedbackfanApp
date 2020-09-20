import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { ProfileModel } from '../../profile/profile.model';
import { icons } from '../../../configuration/icons';
import { roles } from '../../../configuration/roles';
import { ToastController, ModalController } from '@ionic/angular';
import { LanguageService } from '../../core/language/language.service';

@Component({
  selector: 'app-asign-worker',
  templateUrl: './asign-worker.component.html',
  styleUrls: ['./asign-worker.component.scss'],
})
export class AsignWorkerComponent implements OnInit {

  @Input() supervisor: ProfileModel;
  @Input() users: ProfileModel[];

  userSearch = '';
  workers = [];
  usersWorkers: ProfileModel [] = [];
  icons = icons;
  roles = roles;

  constructor(
    private userService: UserService,
    private toastController: ToastController,
    private languageService: LanguageService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.getWorkersOfUsers();
    this.asignSelectedProperty();
  }

  pressed( user ) {
    user.isSelected = !user.isSelected;
    this.setUserIntoArray(user);
  }

  async closeModal() {
    this.modalController.dismiss();
  }

  searchUser( event ) {
    this.userSearch = event.detail.value;
  }

  asignSelectedProperty() {
    this.usersWorkers.forEach( (userr) => {
      let isSelected = false;
      const user = {
        uid: userr.uid,
        email: userr.email,
        name: userr.name,
        role: userr.role,
        image: userr.image,
        sentMessages: userr.sentMessages,
        receivedMessages: userr.receivedMessages,
        allMessagesPublic: userr.allMessagesPublic,
        isShell: userr.isShell,
        isSelected: true,
      };
      this.supervisor.workersInCharge.forEach( userWorkerID => {
        if (userWorkerID === userr.uid) {
          isSelected = true;
        }
      });
      user.isSelected = isSelected;
      this.workers.push(user);
    });
  }

  setUserIntoArray(user: ProfileModel) {
    let userID = '';
    if (this.supervisor.workersInCharge.length === 0) {
      this.supervisor.workersInCharge.push(user.uid);
    } else {
      this.supervisor.workersInCharge.forEach((element, index) => {
        userID = '';
        if (element === user.uid) {
          this.supervisor.workersInCharge.splice(index, 1);
        } else {
          userID = element;
        }
      });
      if (userID !== '') {
        this.supervisor.workersInCharge.push(user.uid);
      }
    }
  }

  getWorkersOfUsers() {
    this.users.forEach( user => {
      if (user.role === roles.employee) {
        this.usersWorkers.push(user);
      }
    });
  }

  setWorkers() {
    this.userService.updateWorkersAssignedToSupervisor(this.supervisor).then(()=> {
      this.presentToast();
    }).catch(error => {
      console.log(error);
    });

  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.languageService.getTerm('trabajadores_asignados'),
      duration: 2000
    });
    toast.present();
  }
}
