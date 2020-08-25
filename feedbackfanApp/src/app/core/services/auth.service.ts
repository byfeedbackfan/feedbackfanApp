import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, Subject, from } from 'rxjs';
import { DataStore } from '../../shell/data-store';
import { ProfileModel } from '../../profile/profile.model';
import { Platform } from '@ionic/angular';

import { User, auth } from 'firebase/app';
import { cfaSignOut } from 'capacitor-firebase-auth';

@Injectable()
export class AuthService {

  currentUser: User;
  userProviderAdditionalInfo: any;
  profileDataStore: DataStore<ProfileModel>;
  redirectResult: Subject<any> = new Subject<any>();

  constructor(
    public angularFire: AngularFireAuth,
    public platform: Platform
  ) {
    this.angularFire.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.currentUser = user;
      } else {
        // No user is signed in.
        this.currentUser = null;
      }
    });

    if (!this.platform.is('capacitor')) {
      // when using signInWithRedirect, this listens for the redirect results
      this.angularFire.getRedirectResult()
      .then((result) => {
        // result.credential.accessToken gives you the Provider Access Token. You can use it to access the Provider API.
        if (result.user) {
          this.userProviderAdditionalInfo = result.additionalUserInfo.profile;
          this.redirectResult.next(result);
        }
      }, (error) => {
        this.redirectResult.next({error: error.code});
      });
    }
  }

  getRedirectResult(): Observable<any> {
    return this.redirectResult.asObservable();
  }

  // Get the currently signed-in user
  getLoggedInUser() {
    return this.currentUser;
  }

  signOut(): Observable<any> {
    if (this.platform.is('capacitor')) {
      return cfaSignOut();
    } else {
      return from(this.angularFire.signOut());
    }
  }

  signInWithEmail(email: string, password: string): Promise<auth.UserCredential> {
    return this.angularFire.signInWithEmailAndPassword(email, password);
  }

  signUpWithEmail(values: any): Promise<auth.UserCredential> {
    return this.angularFire.createUserWithEmailAndPassword(values.email, values.matching_passwords.password);
  }

  async resetPassword(email: string): Promise<void> {
    return await this.angularFire.sendPasswordResetEmail(email);
  }

  async changePassword(values: any): Promise<void> {
    return await (await this.angularFire.currentUser).updatePassword(values.matching_passwords.password);
  }

}
