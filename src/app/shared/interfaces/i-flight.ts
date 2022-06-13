import {Time} from "@angular/common";
import {Route} from "../models/route";
import {Aircraft} from "../models/aircraft";

export interface IFlight {
  id: number,
  number: string,
  schedule: Time,
  airplane: Aircraft,
  route: Route
}
