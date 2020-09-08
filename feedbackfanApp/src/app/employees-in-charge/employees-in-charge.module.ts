import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeesInChargePage } from './employees-in-charge.page';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { ShellModule } from '../shell/shell.module';
import { EmployeeInfoComponent } from './employee-info/employee-info.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeesInChargePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SharedModule,
    ShellModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EmployeesInChargePage, EmployeeInfoComponent]
})
export class EmployeesInChargeModule {}
