import dotenv from 'dotenv'
dotenv.config()

import APP_CONFIGS from './app-configs.json'

/* ENVIRONMENT ============================================================== */
const DEFALT_NODE_ENV = "development"
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : DEFALT_NODE_ENV

/* FUNCTIONS ================================================================ */

import LOGGER from '../utils/logger/logger'
import { delay as DELAY } from '../utils/libraries/utils'
import { importFromRootPath as IMPORT_MODULE, getPathFromRoot as ROOT_PATH } from '../utils/libraries/globalPath'
const GET_BOT_INFO = (botname: string) => APP_CONFIGS['bots_configs'].find(bt => bt['name'] === botname)

import {
  addTimeToDateObject,
  converteDateToUTC,
  getDateInfoObjFromIsoDate,
  convertDateInfoObjToStringDate
} from '../utils/libraries/dates'


let CURRENT_DATE = (): Date => {
  if (NODE_ENV === "production") {
    const _heroku_difference_time_hours = -3
    return addTimeToDateObject(new Date(), _heroku_difference_time_hours)
  } else {
    return new Date()
  }
}


const CURRENT_DATETIME = (option?: 'date' | 'time') => {

  const utcDate = converteDateToUTC(CURRENT_DATE())
  const isoDate = utcDate.toISOString()
  const dateInfoObj = getDateInfoObjFromIsoDate(isoDate)

  return convertDateInfoObjToStringDate(dateInfoObj, option)

}

/* WHATSAPP ================================================================= */

const WPP_IM_GROUP_CHATID = process.env.WPP_IM_GROUP_CHATID

/* TELEGRAM ================================================================= */

const {
  TEL_IM_GROUP_CHATID,
  TEL_BOT_TOKEN,
  NTBA_FIX_319
} = process.env

/* DATABASE ================================================================= */

const {
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_BASEURL,
} = process.env

const DATABASE_SHOULD_START = APP_CONFIGS['database_configs'].should_start
const DATABASE_LOGIN_URL = `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_BASEURL}`

const DATABASE_DATABASE_WPP = APP_CONFIGS['database_configs'].database_wpp
const DATABASE_DATABASE_GENERAL = APP_CONFIGS['database_configs'].database_general
const DATABASE_COLLECTION_VARIABLES = APP_CONFIGS['database_configs'].collection_variables

/* GENERAL ================================================================== */

const VERSION = process.env.npm_package_version || "#"
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379"

/* SERVER =================================================================== */

const SERVER_SHOULD_START = APP_CONFIGS['server_configs'].should_start
const SERVER_PORT = (process.env.PORT || APP_CONFIGS['server_configs'].default_port)?.toString().trim()
const SERVER_DEV_PORT = APP_CONFIGS['server_configs'].development_port?.toString().trim()
const SERVER_JOB_SECONDS = APP_CONFIGS['server_configs'].job_wait_seconds
const SERVER_TOKEN = process.env.SERVER_TOKEN || ''
const SERVER_BASE = NODE_ENV === "production" ? process.env.BASE_URL?.toString().trim() : `http://localhost:${SERVER_DEV_PORT}`

/* WORKER =================================================================== */

const QUEUE_SHOULD_START = APP_CONFIGS['queue_configs'].should_start
const QUEUE_MAX_JOBS = APP_CONFIGS['queue_configs'].max_jobs_per_worker
const QUEUE_NAME = APP_CONFIGS['queue_configs'].queue_name

/* EXPORT =================================================================== */

export {
  APP_CONFIGS,

  NODE_ENV,

  LOGGER,
  DELAY,
  IMPORT_MODULE,
  ROOT_PATH,
  CURRENT_DATE,
  CURRENT_DATETIME,
  GET_BOT_INFO,

  WPP_IM_GROUP_CHATID,

  TEL_BOT_TOKEN,
  TEL_IM_GROUP_CHATID,
  NTBA_FIX_319,

  DATABASE_SHOULD_START,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_BASEURL,
  DATABASE_LOGIN_URL,

  DATABASE_DATABASE_WPP,
  DATABASE_DATABASE_GENERAL,
  DATABASE_COLLECTION_VARIABLES,

  VERSION,
  REDIS_URL,

  SERVER_SHOULD_START,
  SERVER_PORT,
  SERVER_JOB_SECONDS,
  SERVER_TOKEN,
  SERVER_BASE,

  QUEUE_SHOULD_START,
  QUEUE_MAX_JOBS,
  QUEUE_NAME
}
