import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HubRoutingModule} from './hub-routing.module';
import {PageHubFormComponent} from './pages/page-hub-form/page-hub-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatOptionModule} from "@angular/material/core";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

@NgModule({
  declarations: [
    PageHubFormComponent,
  ],
  imports: [
    CommonModule,
    HubRoutingModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatInputModule,
    MatIconModule
  ]
})
export class HubModule { }
