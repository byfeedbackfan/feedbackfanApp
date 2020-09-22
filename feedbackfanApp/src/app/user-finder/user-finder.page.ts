import { Component, OnInit } from '@angular/core';
import { icons, svgIcons } from 'src/configuration/icons';
import { ProfileModel } from '../profile/profile.model';
import { Plugins } from '@capacitor/core';
import { UserService } from '../core/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

const { Storage } = Plugins;

@Component({
  selector: 'app-user-finder',
  templateUrl: './user-finder.page.html',
  styleUrls: ['./styles/user-finder.page.scss'],
})
export class UserFinderPage implements OnInit {

  userSearch = '';
  icons = icons;
  svgIcons = svgIcons;
  userLogged: ProfileModel;
  users: ProfileModel[] = [];
  subscriptions: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) {

    Storage.get({key: 'userCredentials'}).then( user => {
      this.userLogged = JSON.parse(user.value);
      this.userService.getUsers().subscribe(users => {
        this.users = users;
        this.deleteUserLoggedFromArray();
      });
    } );
  }

  ngOnInit() {
    this.subscriptions = this.route.data.subscribe();
  }

  ionViewWillLeave(): void {
    // console.log('TravelListingPage [ionViewWillLeave]');
    this.subscriptions.unsubscribe();
  }

  goToUserProfile(user: ProfileModel) {
    this.userService.setUserProfile({} as ProfileModel);
    this.userService.setUserProfile(user);
    this.router.navigate(['app/user'], { replaceUrl: true });
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

}
