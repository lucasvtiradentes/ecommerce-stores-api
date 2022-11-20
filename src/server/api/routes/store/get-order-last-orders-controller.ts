import {
  LOGGER,
  IMPORT_MODULE
} from '../../../..//configs/configs'

import base64encode from '@wmakeev/base64encode'
import axios from 'axios'
import { Request, Response } from 'express';

import formatShopifyOrderObject from './format-shopify-order-object'
import checkQueriesErros from '../../../components/query-validation'

export default async function curremtController(request: Request, response: Response) {  /* ============================================ */

  const {
    shopifyLink, shopifyUsername, shopifyPassword,
    lastOrder
  } = request.query;

  const queryObj = {
    shopifyLink, shopifyUsername, shopifyPassword,
    lastOrder
  }

  if (checkQueriesErros(queryObj, response) === true) { return }

  try {
    const responseContent = await getLastOrdersObj(queryObj)
    response.json(responseContent)
  } catch (e) {
    console.log(e.message)
    response.json({ result: false })
  }

}

async function getLastOrdersObj(queryObj) { /* ====================================================================== */

  const {
    shopifyLink, shopifyUsername, shopifyPassword,
    lastOrder
  } = queryObj

  const urlToFech = `${shopifyLink}/admin/api/2021-07/orders.json?status=any`;

  const response = await axios.get(urlToFech, {
    "method": "GET",
    "headers": {
      'Content-Type': 'application/json',
      "Authorization": "Basic " + base64encode(`${shopifyUsername}:${shopifyPassword}`)
    }
  });

  const jsonResponse = (await response.data)['orders'];
  const orderNumbersArr = jsonResponse.map(x => x.order_number)

  const indexOfLastOrder = orderNumbersArr.indexOf(Number(lastOrder))
  const newOrders = jsonResponse.slice(0, Number(indexOfLastOrder))
  newOrders.reverse()

  const formatedOrders = newOrders.map((item) => {
    console.log(`FORMAT: ${item.order_number}`)
    const formatedItem = formatShopifyOrderObject(item, queryObj)
    return formatedItem
  })

  return formatedOrders
}
