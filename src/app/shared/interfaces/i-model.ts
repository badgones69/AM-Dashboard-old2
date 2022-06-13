import {Manufacturers} from "../enums/manufacturers";

export interface IModel {
  id: number,
  designation: string,
  manufacturer: Manufacturers
}
