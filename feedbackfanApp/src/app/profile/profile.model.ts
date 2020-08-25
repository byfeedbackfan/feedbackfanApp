import { ShellModel } from '../shell/data-store';

export class ProfileModel extends ShellModel {
  uid: string;
  email: string;
  name: string;
  role: string;
  image: string;
  sentMessages: number;
  receivedMessages: number;
  provider: string;

  constructor() {
    super();
  }
}
