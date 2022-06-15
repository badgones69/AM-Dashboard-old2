import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {APP_NAME} from "../../../shared/constants/app-constants";
import packageJson from "../../../../../../AM-Dashboard/package.json";

@Component({
  selector: 'app-page-about',
  templateUrl: './page-about.component.html',
  styleUrls: ['./page-about.component.scss']
})
export class PageAboutComponent implements OnInit {

  public appName = APP_NAME;
  public appVersion = packageJson.version;
  public appAuthor = packageJson.author;

  public properties: any[] = [];

  constructor(public dialog: MatDialog) {
    this.properties.push({name : 'Date de sortie', value : packageJson.releaseDate});
    this.properties.push({name : 'Licence', value : packageJson.license});
    this.properties.push({name : 'NodeJS', value : packageJson.nodeJS});
    this.properties.push({name : 'Angular', value : packageJson.devDependencies["@angular/cli"].replace('~', '')});
    this.properties.push({name : 'TypeScript', value : packageJson.devDependencies["typescript"].replace('~', '')});
    this.properties.push({name : 'Karma', value : packageJson.devDependencies["karma"].replace('~', '')});
    this.properties.push({name : 'Jasmine', value : packageJson.devDependencies["jasmine-core"].replace('~', '')});
    this.properties.push({name : 'RxJS', value : packageJson.dependencies["rxjs"].replace('~', '')});
    this.properties.push({name : 'NGx Toastr', value : packageJson.dependencies["ngx-toastr"].replace('^', '')});
    this.properties.push({name : 'Flag Icons', value : packageJson.dependencies["flag-icons"].replace('^', '')});
  }

  ngOnInit(): void {
    // This class will never be initialized
  }

  closeDialog() {
    this.dialog.closeAll();
  }

}
