import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageAboutComponent} from "./pages/page-about/page-about.component";

const routes: Routes = [
  {path: 'help', component: PageAboutComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpRoutingModule { }
