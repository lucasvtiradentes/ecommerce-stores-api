import throng from "throng";

import {
  CURRENT_DATETIME, QUEUE_SHOULD_START,
} from '../..//configs/configs'

import Worker from './models/Worker'

import { IWorkerGlobals } from './interfaces/IWorkerGlobals'
import queueJob from '../../queue/index'

declare global {
  var WORKER: IWorkerGlobals
}

export default async function initWorkerCluster(){

  const newWorker = new Worker(process)
  await newWorker.initWorker()

  if (QUEUE_SHOULD_START === true) {
    setTimeout(async () => {
      throng({ worker: queueJob, count: 1 })
    }, 5000);
  }

  global.WORKER = {
    workerCluster: newWorker,
    workerSharedInfo: {
      workerProcessPid: process.pid,
      workerData: {
        workerInfo: {
          loopInterval: 60,
          startedTime: CURRENT_DATETIME(),
          isSpybotActive: false,
        },
        spyBotInfo: {
          lastCheckedTime: '-',
          checkedCount: 0,
          lastSaleTime: '-',
          salesCount: 0,
          salesRevenue: 0,
          spyedStores: []
        }
      }
    }
  }
}
