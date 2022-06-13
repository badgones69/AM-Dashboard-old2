import {IAirport} from "../interfaces/i-airport";

export class Airport implements IAirport {
  id!: number;
  iata!: string;
  name!: string;
  city!: number;
  country!: Country;
  region!: Region | null;
  hub!: boolean;
}
