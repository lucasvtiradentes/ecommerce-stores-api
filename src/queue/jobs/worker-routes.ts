import {
  IMPORT_MODULE,
} from '../..//configs/configs'


import wppSendMessage from './wpp_send-message/wpp-send-message'
import wppLogger from './wpp_logger-in-group/wpp-logger-message'

import telSendMessage from './tel_send-message/tel-send-message'
import telLogger from './tel_logger-in-group/tel-logger-in-group'
import telImage from './tel_image-in-group/tel-image-in-group'

import herokuLogin from './gen_heroku_login/login-job'
import herokuRestart from './gen_heroku_restart/restart-job'

import controlleLogin from './gen_controlle_login/login-job'
import controlleAddTransaction from './gen_controlle_add-transaction/add-transaction-job'

import aliexpressLogin from './gen_aliexpress_login/login-job'
import aliexpressLogout from './gen_aliexpress_logout/logout-job'
import aliexpressGetOrderInfo from './gen_aliexpress_get-order-info/get-order-info-job'
import aliexpressCheckLogin from './gen_aliexpress_check-login/check-login-job'
import aliexpressTypeCode from './gen_aliexpress_type-code/type-code-job'

export default async function getWorkerJobs(){
  let workerJobs = []

  workerJobs.push(...[
    ["/api/whatsapp/sendmessage", wppSendMessage],
    ["/api/whatsapp/logger", wppLogger]
  ])

  workerJobs.push(...[
    ["/api/telegram/sendmessage", telSendMessage],
    ["/api/telegram/logger", telLogger],
    ["/api/telegram/image", telImage]
  ])

  workerJobs.push(...[
    ["/api/heroku/login", herokuLogin],
    ["/api/heroku/restart", herokuRestart],

    ["/api/controlle/login", controlleLogin],
    ["/api/controlle/addtransaction", controlleAddTransaction],

    ["/api/aliexpress/login", aliexpressLogin],
    ["/api/aliexpress/logout", aliexpressLogout],
    ["/api/aliexpress/getstoreorderinfo", aliexpressGetOrderInfo],
    ["/api/aliexpress/checklogin", aliexpressCheckLogin],
    ["/api/aliexpress/typecode", aliexpressTypeCode]
  ])

  return workerJobs
}
