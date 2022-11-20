import { LOGGER } from "..//configs/configs"

export default function exportGlobalWorkers() {

  LOGGER("SETTING GLOBALS VARS", { from: 'QUEUE', pid: true })

  let workerGlobals = {
    DBCLIENT: undefined,
    WPPBOT: undefined,
    TELBOT: undefined,
    GENBOT: undefined
  }

  return workerGlobals
}
