import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RouteRoutingModule} from './route-routing.module';
import {PageCreateRouteFormComponent} from './pages/page-create-route-form/page-create-route-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatOptionModule} from "@angular/material/core";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [
    PageCreateRouteFormComponent
  ],
  imports: [
    CommonModule,
    RouteRoutingModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatInputModule,
    MatIconModule
  ]
})
export class RouteModule { }
