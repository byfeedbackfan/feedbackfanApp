import { Component, OnInit, HostBinding} from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ProfileModel } from './profile.model';
import { AuthService } from '../../core/services/auth.service';

import { Plugins } from '@capacitor/core';
import { ProfileResolver } from './profile.resolver';

const { Storage } = Plugins;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: [
    './styles/profile.page.scss',
    './styles/profile.shell.scss'
  ]
})
export class ProfilePage implements OnInit {
  user: ProfileModel;

  @HostBinding('class.is-shell') get isShell() {
    return (this.user && this.user.isShell) ? true : false;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileResolver: ProfileResolver
  ) {}

  ngOnInit() {
    this.profileResolver.resolve().then((user) => {
      this.user = user;
    });
  }

  signOut() {
    this.authService.signOut().subscribe(() => {
      // Sign-out successful.
      // Replace state as we are no longer authorized to access profile page.
      Storage.clear();
      this.router.navigate(['auth/sign-in'], { replaceUrl: true });
    }, (error) => {
      console.log('signout error', error);
    });
  }

  async getUserDataFromStorage(): Promise<ProfileModel> {
    let userData;
    userData = await Storage.get({key: 'userCredentials'});
    userData = JSON.parse(userData.value);
    return userData;
  }
}
