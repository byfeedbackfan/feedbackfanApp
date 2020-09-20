import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileModel } from '../../profile/profile.model';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user: ProfileModel;
  public users: Subject<ProfileModel[]> = new BehaviorSubject<ProfileModel[]>([]);

  constructor(private afs: AngularFirestore) { }

  public get allUsers(): Observable<ProfileModel[]> {
    return this.users.asObservable();
  }

  public setAllUsers(users: ProfileModel[]) {
    this.users.next(users);
  }

  public getUserProfile(): ProfileModel {
    return this.user;
  }

  public setUserProfile(user: ProfileModel) {
    this.user = user;
  }

  public getUserSupervisor(): ProfileModel {
    return this.user;
  }

  public setUserSupervisor(user: ProfileModel) {
    this.user = user;
  }

  public createUser(userData: ProfileModel): Promise<void> {
    return this.afs.collection('user').doc(userData.uid).set({...userData});
  }

  public updateUser(userData: ProfileModel): Promise<void> {
    const data = {
      uid: userData.uid,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      image: userData.image,
      sentMessages: userData.sentMessages,
      receivedMessages: userData.receivedMessages,
      isShell: userData.isShell,
      allMessagesPublic: userData.allMessagesPublic,
      workersInCharge: userData.workersInCharge,
    };
    return this.afs.collection('user').doc(userData.uid).set(data);
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

  public getUsers(): Observable<ProfileModel[]> {
    return this.afs.collection(`user`)
    .get()
    .pipe(
      map( actions => actions.docs.map( a => {
        const usersData = a.data();
        return usersData as ProfileModel;
      }))
    );
  }

  public addQuantityToSentMessages(uid: string, quantity: number): Promise<void> {
    const increment = firebase.firestore.FieldValue.increment(quantity);
    return this.afs.collection(`user`).doc(uid).update({sentMessages: increment});
  }

  public addOneToReceivedmessages(user: ProfileModel): Promise<void> {
    const increment = firebase.firestore.FieldValue.increment(1);
    return this.afs.collection(`user`).doc(user.uid).update({receivedMessages: increment});
  }

  public updateWorkersAssignedToSupervisor(user: ProfileModel): Promise<void> {
    return this.afs.collection(`user`).doc(user.uid).update({workersInCharge: user.workersInCharge});
  }
}
