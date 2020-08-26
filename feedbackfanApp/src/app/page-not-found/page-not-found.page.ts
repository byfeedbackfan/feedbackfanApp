import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { staticText } from '../../configuration/staticText';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.page.html',
  styleUrls: [
    './styles/page-not-found.page.scss'
  ]
})
export class PageNotFoundPage {
  staticText = staticText;

  constructor(public menu: MenuController) { }

  // Disable side menu for this page
  ionViewDidEnter(): void {
    this.menu.enable(false);
  }

  // Restore to default when leaving this page
  ionViewDidLeave(): void {
    this.menu.enable(true);
  }
}
