import Worker from "../models/Worker";
import {IWorkerSharedInformation} from './IWorkerSharedInformation'

interface IWorkerGlobals {

  DBCLIENT?: any,
  WPPBOT?: any,
  TELBOT?: any,
  GENBOT?: any,

  workerCluster?: Worker;
  workerSharedInfo?: IWorkerSharedInformation;
}

export {IWorkerGlobals}
