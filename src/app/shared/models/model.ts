import {IModel} from "../interfaces/i-model";
import {Manufacturers} from "../enums/manufacturers";

export class Model implements IModel {
  id!: number;
  designation!: string;
  manufacturer!: Manufacturers;
}
