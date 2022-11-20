import {
  IMPORT_MODULE
} from '../../..//configs/configs'

import getQrcodeJson from './worker/whatsapp/get-qrcode-image'
import whatsappSendMessage from './worker/whatsapp/send-message-controller'
import whatsappLogger from './worker/whatsapp/logger-in-group-controller'

import telegramSendMessage from './worker/telegram/send-message-controller'
import telegramLogger from './worker/telegram/logger-in-group-controller'
import telegramImage from './worker/telegram/image-in-group-controller'

import aliexpressCheckLogin from './worker/general/aliexpress_check-login-controller'
import aliexpressGetOrder from './worker/general/aliexpress_get-store-order-info-controller'
import aliexpressLogin from './worker/general/aliexpress_login-controller'
import aliexpressLogout from './worker/general/aliexpress_logout-controller'
import aliexpressTypeCode from './worker/general/aliexpress_type-code-controller'
import controlleAddTransaction from './worker/general/controlle_add-transaction-controller'
import controlleLogin from './worker/general/controlle_login-controller'
import herokuLogin from './worker/general/heroku_login-controller'
import herokuRestart from './worker/general/heroku_restart-controller'

import getInfoFromCorreios from './store/get-order-info-in-correios-controller'
import getInfoFromShopify from './store/get-order-info-in-shopify-controller'
import getLastOrders from './store/get-order-last-orders-controller'

export default function getApiRoutes(baseUrl: string){

  let apiRoutes = []

  // WORKER ====================================================================
  apiRoutes.push(...[
    ["get", "/whatsapp/getqrcode", [getQrcodeJson]],
    ["get", "/whatsapp/sendmessage", [whatsappSendMessage]],
    ["get", "/whatsapp/logger", [whatsappLogger]]
  ])

  apiRoutes.push(...[
    ["get", "/telegram/sendmessage", [telegramSendMessage]],
    ["get", "/telegram/logger", [telegramLogger]],
    ["post", "/telegram/image", [telegramImage]],
  ])

  apiRoutes.push(...[
    ["get", "/heroku/login", [herokuLogin]],
    ["get", "/heroku/restart", [herokuRestart]],

    ["get", "/controlle/login", [controlleLogin]],
    ["get", "/controlle/addtransaction", [controlleAddTransaction]],

    ["get", "/aliexpress/login", [aliexpressLogin]],
    ["get", "/aliexpress/logout", [aliexpressLogout]],
    ["get", "/aliexpress/getstoreorderinfo", [aliexpressGetOrder]],
    ["get", "/aliexpress/checklogin", [aliexpressCheckLogin]],
    ["get", "/aliexpress/typecode", [aliexpressTypeCode]]
  ])

  // SHOPIFY ===================================================================
  apiRoutes.push(...[
    ["get", "/store/getorderinfo_shopify", [getInfoFromShopify]],
    ["get", "/store/getorderinfo_correios", [getInfoFromCorreios]],
    ["get", "/store/getlastorders", [getLastOrders]],
  ])

  apiRoutes = apiRoutes.map(route => [route[0], `${baseUrl}${route[1]}`, route[2]])

  return apiRoutes
}
