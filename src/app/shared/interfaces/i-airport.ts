import {Country} from "../models/country";
import {Region} from "../models/region";

export interface IAirport {
  id: number,
  iata: string,
  name: string,
  city: number,
  country: Country,
  region: Region | null,
  hub: boolean
}
