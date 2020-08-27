import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsRoutingModule,
    TranslateModule
  ],
  declarations: [ TabsPage ]
})
export class TabsModule {}
