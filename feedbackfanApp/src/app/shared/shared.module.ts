import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';
import { IonicModule } from '@ionic/angular';
import { TabsComponent } from './tabs/tabs.component';



@NgModule({
  declarations: [
    ShowHidePasswordComponent,
    TabsComponent,
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot()
  ],
  exports: [
    ShowHidePasswordComponent,
    TabsComponent
  ]
})
export class SharedModule { }
