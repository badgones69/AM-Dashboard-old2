import {IFlight} from "../interfaces/i-flight";
import {Time} from "@angular/common";
import {Aircraft} from "./aircraft";

export class Flight implements IFlight {
  id: number;
  number!: string;
  schedule!: Time;
  airplane!: Aircraft;
  route!: Route;
}
