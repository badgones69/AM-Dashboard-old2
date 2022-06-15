import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PageHubFormComponent} from "./pages/page-hub-form/page-hub-form.component";

const routes: Routes = [
  {path: 'new', component : PageHubFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HubRoutingModule { }
