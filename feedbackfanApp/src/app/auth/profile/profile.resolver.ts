import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { DataStore } from '../../shell/data-store';
import { ProfileModel } from './profile.model';

@Injectable()
export class ProfileResolver implements Resolve<any> {

  constructor(private firebaseAuthService: AuthService) {}

  resolve() {
    const dataSource: Observable<ProfileModel> = this.firebaseAuthService.getProfileDataSource();
    const dataStore: DataStore<ProfileModel> = this.firebaseAuthService.getProfileStore(dataSource);
    return dataStore;
  }
}
