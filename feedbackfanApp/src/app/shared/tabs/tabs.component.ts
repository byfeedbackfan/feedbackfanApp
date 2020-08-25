import { Component } from '@angular/core';

import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.component.html',
  styleUrls: [
    './styles/tabs.component.scss'
  ]
})
export class TabsComponent {
  userLogged: boolean;

  constructor(
    public menu: MenuController,
    ) { }

  ionViewWillEnter() {
    this.menu.enable(true);
  }
}
