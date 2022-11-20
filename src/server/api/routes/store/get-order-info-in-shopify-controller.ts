import {
  LOGGER,
  IMPORT_MODULE
} from '../../../..//configs/configs'

import base64encode from '@wmakeev/base64encode'
import axios from 'axios'

import checkQueriesErros from '../../../components/query-validation'
import formatShopifyOrderObject from './format-shopify-order-object'
import { Request, Response } from 'express'

export default async function curremtController(request: Request, response: Response) {  /* ============================================ */

  const {
    shopifyLink, shopifyUsername, shopifyPassword, orderNumber, formatResult
  } = request.query;

  const queryObj = {
    shopifyLink, shopifyUsername, shopifyPassword, orderNumber, formatResult
  }

  if (checkQueriesErros(queryObj, response) === true) { return }

  try {
    const responseContent = await getOrderInfo(queryObj)

    if (formatResult === 'true') {
      const formatedContent = await formatShopifyOrderObject(responseContent, queryObj)
      response.json(formatedContent)
    } else {
      response.json(responseContent)
    }

  } catch (e) {
    console.log(e.message)
    response.json({ result: false })
  }

}

async function getOrderInfo(queryObj) { /* ========================================================================== */

  const { shopifyUsername, shopifyPassword, orderNumber } = queryObj

  console.log("  -> get order information from shopify: " + orderNumber)

  const urlToFech = generateShopifyOrderLink(queryObj)

  let response = await axios.get(urlToFech, {
    "method": "GET",
    "headers": {
      'Content-Type': 'application/json',
      "Authorization": "Basic " + base64encode(`${shopifyUsername}:${shopifyPassword}`)
    }
  });

  const jsonResponse = await response.data || {};
  return jsonResponse['orders'][0]
}

function generateShopifyOrderLink(queryObj) { /* ===================================================================== */

  const { shopifyLink, orderNumber } = queryObj
  const urlToFech = `${shopifyLink}/admin/api/2021-07/orders.json?status=any&name=${orderNumber}`;
  return urlToFech

}

/* ################################################################################################################################# */
