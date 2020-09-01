import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileModel } from '../../profile/profile.model';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore) { }

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

  public getUsers(uid: string): Observable<ProfileModel[]> {
    return this.afs.collection(`user`)
    .snapshotChanges()
    .pipe(
      map( actions => actions.map( a => {
        const usersData = a.payload.doc.data();
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
}
