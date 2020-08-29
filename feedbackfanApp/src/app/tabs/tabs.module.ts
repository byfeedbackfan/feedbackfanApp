import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { TranslateModule } from '@ngx-translate/core';
import { SendMessageModule } from '../send-message/send-message.module';
import { SendedMessageModule } from '../sended-message/sended-message.module';
import { TabsResolver } from './tabs.resolver';
import { TabsGuard } from './tabsguard';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsRoutingModule,
    TranslateModule,
    SendMessageModule,
    SendedMessageModule,
  ],
  declarations: [ TabsPage ],
  providers: [
    TabsResolver,
    TabsGuard
  ]
})
export class TabsModule {}
