import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ProfileModel } from '../profile/profile.model';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable()
export class TabsGuard implements CanActivate {

  constructor(private router: Router) {}

  async canActivate(): Promise<boolean> {
    let userData: ProfileModel;
    await Storage.get({key: 'userCredentials'}).then(data => {
      if (data.value) {
        userData = JSON.parse(data.value);
      } else {
        this.router.navigate(['auth/sign-in'], { replaceUrl: true });
      }
    });
    if (userData) {
      return true;
    } else {
      return false;
    }
  }
}
