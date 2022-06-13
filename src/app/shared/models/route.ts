import {IRoute} from "../interfaces/i-route";
import {Airport} from "./airport";

export class Route implements IRoute{
  id!: number;
  arrivalAirport!: Airport;
  departureAirport!: Airport;

}
