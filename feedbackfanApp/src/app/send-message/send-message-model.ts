import { ShellModel } from '../shell/data-store';
import { ProfileModel } from '../profile/profile.model';

export class SendMessageModel extends ShellModel {
  id: string;
  from: string;
  to: string;
  uidSender: string;
  uidReceiver: string;
  date: Date;
  title: string;
  message: string;
  likes: number;
  dislikes: number;
  usersLike: string[];
  usersDislike: string[];
  isPublishableSender: boolean;
  isPublishableReceiver: boolean;
  readed: boolean;

  constructor() {
    super();
  }
}
