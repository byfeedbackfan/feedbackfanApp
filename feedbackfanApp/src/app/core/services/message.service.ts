import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileModel } from '../../profile/profile.model';
import { SendMessageModel } from '../../send-message/send-message-model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private afs: AngularFirestore) { }

  public createSenderMessage(message: SendMessageModel, uidSender: string): Promise<DocumentReference> {
    console.log(uidSender);
    const data = {
      from: message.from,
      to: message.to,
      date: message.date,
      title: message.title,
      message: message.message,
      likes: message.likes,
      dislikes: message.dislikes,
      isPublishableSender: message.isPublishableSender,
      isPublishableReceiver: message.isPublishableReceiver,
    };
    return this.afs.doc(`user/${uidSender}`).collection('sentMessage').add(data);
  }

  public createReceiverMessage(message: SendMessageModel, uidReceiver: string): Promise<DocumentReference> {
    console.log(uidReceiver);
    const data = {
      from: message.from,
      to: message.to,
      date: message.date,
      title: message.title,
      message: message.message,
      likes: message.likes,
      dislikes: message.dislikes,
      isPublishableSender: message.isPublishableSender,
      isPublishableReceiver: message.isPublishableReceiver,
    };
    return this.afs.doc(`user/${uidReceiver}`).collection('receivedMessage').add(data);
  }
}
