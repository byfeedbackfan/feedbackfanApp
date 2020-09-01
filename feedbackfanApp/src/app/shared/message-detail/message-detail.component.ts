import { Component, OnInit, Input } from '@angular/core';
import { SendMessageModel } from '../../send-message/send-message-model';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { ProfileModel } from '../../profile/profile.model';


@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.scss'],
})
export class MessageDetailComponent implements OnInit {

  @Input() messageDetail: SendMessageModel;
  @Input() userLogged: ProfileModel;

  translations;

  constructor(
    public translate: TranslateService,
    public modalController: ModalController,
  ) { }

  async ngOnInit() {
    this.getTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.getTranslations();
    });
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe(async (translations) => {
      this.translations = translations;
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  shearchUserInLikesArray(message: SendMessageModel): boolean {
    let userAlreadyLiked = false;
    message.usersLike.forEach( uid => {
      if (this.userLogged.uid === uid) {
        userAlreadyLiked = true;
      }
    });
    return userAlreadyLiked;
  }

  shearchUserDislikesArray(message: SendMessageModel): boolean {
    let userAlreadyUnliked = false;
    message.usersDislike.forEach( uid => {
      if (this.userLogged.uid === uid) {
        userAlreadyUnliked = true;
      }
    });
    return userAlreadyUnliked;
  }

}
