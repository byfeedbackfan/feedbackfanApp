import { Injectable, Query, QueryList } from '@angular/core';
import { AngularFirestore, DocumentReference, QueryDocumentSnapshot, DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { SendMessageModel } from '../../send-message/send-message-model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private afs: AngularFirestore) { }
  receivedMessages: SendMessageModel[];
  sentMessages: SendMessageModel[];

  getReceivedMessagesGlobal(): SendMessageModel[] {
    return this.receivedMessages;
  }

  setReceivedMessagesGlobal(messages: SendMessageModel[]) {
    this.receivedMessages = [];
    this.receivedMessages = messages;
  }

  getSentMessagesGlobal(): SendMessageModel[] {
    return this.sentMessages;
  }

  setSentMessagesGlobal(messages: SendMessageModel[]) {
    this.sentMessages = [];
    this.sentMessages = messages;
  }

  public createMessage(message: SendMessageModel): Promise<void> {
    const idMessage = this.afs.createId();
    const data = {
      id: idMessage,
      from: message.from,
      to: message.to,
      uidSender: message.uidSender,
      uidReceiver: message.uidReceiver,
      date: message.date,
      title: message.title,
      message: message.message,
      likes: message.likes,
      dislikes: message.dislikes,
      usersLike: message.usersLike,
      usersDislike: message.usersDislike,
      isPublishableSender: message.isPublishableSender,
      isPublishableReceiver: message.isPublishableReceiver,
      readed: message.readed,
    };
    return this.afs.collection('message').doc(idMessage).set(data);
  }

  getSentMessages(uid: string): Observable<any> {
    return this.afs.collection('message', ref => ref.where('uidSender', '==', uid).orderBy('date', 'desc'))
    .snapshotChanges()
    .pipe(map(a => {
      const messages: SendMessageModel[] = [];
      a.forEach(message => {
        messages.push(message.payload.doc.data() as SendMessageModel);
      });
      return messages;
    }));
  }

  getReceivedMessagesSnapshot(uid: string): Observable<any> {
    return this.afs.collection('message', ref => ref.where('uidReceiver', '==', uid).orderBy('readed', 'asc').orderBy('date', 'desc'))
    .snapshotChanges().pipe(map(a => {
      const messages: SendMessageModel[] = [];
      a.forEach(message => {
        messages.push(message.payload.doc.data() as SendMessageModel);
      });
      return messages;
    }));
  }

  getReceivedMessages(uid: string): Observable<any> {
    return this.afs.collection('message', ref => ref.where('uidReceiver', '==', uid).orderBy('date', 'desc'))
    .get().pipe(map(a => {
      const messages: SendMessageModel[] = [];
      a.forEach(message => {
        messages.push(message.data() as SendMessageModel);
      });
      return messages;
    }));
  }

  updateMessage(message: SendMessageModel) {
    const data = {
      id: message.id,
      from: message.from,
      to: message.to,
      uidSender: message.uidSender,
      uidReceiver: message.uidReceiver,
      date: message.date,
      title: message.title,
      message: message.message,
      likes: message.likes,
      dislikes: message.dislikes,
      usersLike: message.usersLike,
      usersDislike: message.usersDislike,
      isPublishableSender: message.isPublishableSender,
      isPublishableReceiver: message.isPublishableReceiver,
      readed: message.readed,
    };
    return this.afs.collection('message').doc(message.id).update(data);
  }

  getMessages(): Observable<SendMessageModel[]> {
    return this.afs.collection('message')
      .get()
      .pipe(map (a => {
        const messages: SendMessageModel[] = [];
        a.forEach(message => {
          messages.push(message.data() as SendMessageModel);
        });
        return messages;
      }));
  }
}
