import Queue from "bull";
import mongoose from 'mongoose'

import {
  REDIS_URL,
  QUEUE_MAX_JOBS,
  QUEUE_NAME,
  GET_BOT_INFO,
  DATABASE_LOGIN_URL,
  DATABASE_DATABASE_WPP,
  LOGGER,
  NODE_ENV,
  CURRENT_DATETIME,
  DATABASE_SHOULD_START
} from '..//configs/configs'

import connectDatabase from "../connectDatabase";
import runWorkerNewJob from './components/run-worker-new-job';
import initWppClient from './bots/whatsapp-bot/init-wpp-client'
import initTelClient from './bots/telegram-bot/init-tel-client'
import initGenClient from './bots/general-bot/init-general-client'
import setWorkerGlobals from './workerGlobals'

export default async function worker(id) {

  LOGGER(`QUEUE INICIADO COM ID = ${id} e PID = ${process.pid}`, { from: 'QUEUE', pid: true })

  global.WORKER = setWorkerGlobals()

  try{

    const mongooseOpt = {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    }

    if (DATABASE_SHOULD_START === true){
      global.WORKER['DBCLIENT'] = await connectDatabase()
    }

    if (NODE_ENV !== "development"){
      if (GET_BOT_INFO('WPP BOT').active == true) {
        mongoose.connect(`${DATABASE_LOGIN_URL}/${DATABASE_DATABASE_WPP}`, mongooseOpt).then(() => {
          LOGGER('Connected to WPP MongoDB', { from: 'QUEUE', pid: true })
        })
        await initWppClient(global.WORKER.DBCLIENT)
      }

      if (GET_BOT_INFO('GEN BOT').active == true) {
        global.WORKER['GENBOT'] = await initGenClient()
      }

      if (GET_BOT_INFO('TEL BOT').active == true){
        global.WORKER['TELBOT'] = await initTelClient();
        LOGGER(`Servidor iniciado em modo ${NODE_ENV} às ${CURRENT_DATETIME()}`, { from: 'QUEUE', pid: true, logger: "telegram" })
      }
    }


    const WORKERQUEUE = new Queue(QUEUE_NAME, REDIS_URL);
    WORKERQUEUE.process(QUEUE_MAX_JOBS, runWorkerNewJob)

  }catch(e){
    LOGGER(`ERRO NO QUEUE COM ID = ${id} e PID = ${process.pid}`, { from: 'QUEUE', pid: true })
    console.log(e.message)
  }

  LOGGER(`QUEUE FINALIZADO COM ID = ${id} e PID = ${process.pid}`, { from: 'QUEUE', pid: true })
}
