import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageAboutComponent } from './pages/page-about/page-about.component';
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
  declarations: [
    PageAboutComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule
  ]
})
export class HelpModule { }
