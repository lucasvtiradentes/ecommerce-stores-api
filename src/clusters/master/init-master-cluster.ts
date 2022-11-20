import {
  LOGGER,
  NODE_ENV,
  REDIS_URL,
} from '../..//configs/configs'

import Queue from 'bull'

import initServer from '../../server/index';
import Master from './models/Master'

import { IMasterGlobals } from './interfaces/IMasterGlobals'

declare global {
  var MASTER: IMasterGlobals
}

export default async function initMasterCluster(){

  console.log('\n\n')
  LOGGER(`Executando MASTER em ambiente [${NODE_ENV}]`, { from: 'MASTER', pid: true })

  global.WORKERQUEUE = new Queue('worker', REDIS_URL);
  global.WORKERQUEUE.on('global:completed', (jobId: string, result: string) => {
    const resultJson = JSON.parse(result)
    LOGGER(`${jobId} | completed -> ${resultJson.jobMessage} |  ${JSON.stringify(resultJson.jobResult)}`, {from: 'SERVER', pid: true})
  });


  global.SERVER = initServer()

  const masterInstance = new Master()

  masterInstance.createWorkerInstance()

  masterInstance.runWhenWorkersAreReady().then(async (RES) => {
    LOGGER('Todos os worker foram iniciados\n', { from: 'MASTER', pid: true })

    global.MASTER = {
      masterCluster: masterInstance,
    }

  })

}
