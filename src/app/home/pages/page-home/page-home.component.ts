import {Component, OnInit} from '@angular/core';
import {AirlineService} from "../../../shared/services/airline.service";
import {APP_NAME} from "../../../shared/constants/app-constants";

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss']
})
export class PageHomeComponent implements OnInit {

  public welcomeMessage!: string;

  constructor(private airlineService: AirlineService) {
  }

  ngOnInit(): void {
    this.airlineService.getAirline(1).subscribe(
      airline => {
        this.welcomeMessage = 'le portail de la compagnie ' + airline.name;
      },
      () => this.welcomeMessage = `l\'application ${APP_NAME}`
    );
  }
}
