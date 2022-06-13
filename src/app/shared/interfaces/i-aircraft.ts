import {Model} from "../models/model";

export interface IAircraft {
  id: number,
  serialNumber: string,
  model: Model,
  modelCopyNumber: string
}
