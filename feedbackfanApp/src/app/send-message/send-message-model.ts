import { ShellModel } from '../shell/data-store';

export class SendMessageModel extends ShellModel {
  from: string;
  to: string;
  date: Date;
  title: string;
  message: string;
  likes: number;
  dislikes: number;
  isPublishableSender: boolean;
  isPublishableReceiver: boolean;

  constructor() {
    super();
  }
}
