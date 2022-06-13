import {IAirline} from "../interfaces/i-airline";

export class Airline implements IAirline {
  id!: number;
  icao!: string;
  name!: string;
}
