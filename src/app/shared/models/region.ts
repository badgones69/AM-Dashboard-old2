import {IRegion} from "../interfaces/i-region";

export class Region implements IRegion {
  id!: number;
  isoAlpha2!: string;
  name!: string;
  countryId!: number;
}
