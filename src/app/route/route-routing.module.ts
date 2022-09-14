import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageCreateRouteFormComponent} from "./pages/page-create-route-form/page-create-route-form.component";

const routes: Routes = [
  {path: 'new', component : PageCreateRouteFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
