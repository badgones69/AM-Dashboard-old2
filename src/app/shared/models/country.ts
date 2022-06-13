import {ICountry} from "../interfaces/i-country";

export class Country implements ICountry {
  id!: number;
  isoAlpha2!: string;
  name!: string;
}
