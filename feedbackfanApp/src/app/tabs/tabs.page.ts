import { Component } from '@angular/core';

import { MenuController } from '@ionic/angular';
import { staticText } from '../../configuration/staticText';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: [
    './styles/tabs.page.scss'
  ]
})
export class TabsPage  {
  staticText = staticText;

  constructor(public menu: MenuController) { }

  ionViewWillEnter() {
    this.menu.enable(true);
  }
}
