import { ShellModel } from '../shell/data-store';

export class UserRankingModel extends ShellModel {
  uid: string;
  image: string;
  sentMessages: number;
  sentMessagesLikes: number;
  sentMessagesDislikes: number;
  receivedMessages: number;
  receivedMessagesLikes: number;
  receivedMessagesDislikes: number;

  constructor() {
    super();
  }
}
