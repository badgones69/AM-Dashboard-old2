import {Airport} from "../models/airport";

export interface IRoute {
  id: number,
  departureAirport: Airport,
  arrivalAirport: Airport
}
