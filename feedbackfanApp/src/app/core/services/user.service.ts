import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';

import { Observable, of, forkJoin, throwError, combineLatest } from 'rxjs';
import { map, concatMap, first, filter } from 'rxjs/operators';
import { DataStore, ShellModel } from '../../shell/data-store';
import { ProfileModel } from '../../auth/profile/profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore) { }

  public createUser(userData: ProfileModel): Promise<void> {
    return this.afs.collection('user').doc(userData.uid).set({...userData});
  }

  public updateUser(userData: ProfileModel): Promise<void> {
    return this.afs.collection('users').doc(userData.uid).set(userData);
  }

  public getUser(uid: string): Observable<ProfileModel> {
    return this.afs.doc(`user/${uid}`).snapshotChanges()
    .pipe(
      map( a => {
        const userData = a.payload.data();
        return userData as ProfileModel;
      })
    );
  }
}
