import {IAircraft} from "../interfaces/i-aircraft";
import {Model} from "./model";

export class Aircraft implements IAircraft {
  id!: number;
  serialNumber!: string;
  model!: Model;
  modelCopyNumber!: string;
}
