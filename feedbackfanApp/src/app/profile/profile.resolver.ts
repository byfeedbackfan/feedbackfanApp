import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { ProfileModel } from './profile.model';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable()
export class ProfileResolver implements Resolve<any> {

  constructor(
    private router: Router,
  ) {}

  async resolve(): Promise<ProfileModel> {
    let userData: ProfileModel;
    await Storage.get({key: 'userCredentials'}).then(data => {
      if (data.value) {
        userData = JSON.parse(data.value);
      } else {
        this.router.navigate(['auth/sign-in'], { replaceUrl: true });
      }
    });
    return userData;
  }
}
