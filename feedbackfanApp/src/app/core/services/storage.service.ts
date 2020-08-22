import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async uploadUserImg(source: string, uid: string) {
    return new Promise<string>(function (resolve, reject) {
      const storage = firebase.storage().ref(`user/${uid}`).child(`profileImg.jpg`);
      const uploadTask = storage.putString(source, firebase.storage.StringFormat.DATA_URL);

      uploadTask.on('state_changed', null, (error) => {
          reject(error);
        }, async () => {
          await uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            resolve(downloadURL);
          });
        });
    });
  }
}
