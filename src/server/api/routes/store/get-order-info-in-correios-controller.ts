import {
  LOGGER,
  IMPORT_MODULE
} from '../../../..//configs/configs'

import axios from 'axios'
import checkQueriesErros from '../../../components/query-validation'
import { Request, Response } from 'express';

/* ################################################################################################################################# */

export default async function currentController(request: Request, response: Response) {  /* ============================================ */

  const {
    trackingOrderNumber, customerCity
  } = request.query;

  const queryObj = {
    trackingOrderNumber, customerCity
  }

  if (checkQueriesErros(queryObj, response) === true) { return }

  try {
    const responseContent = await getOrderInfo(queryObj)
    response.json(responseContent)
  } catch (e) {
    console.log(e.message)
    response.json({ result: false })
  }

}

async function getOrderInfo(queryObj) { /* ========================================================================== */

  const {
    trackingOrderNumber, customerCity
  } = queryObj

  console.log("  -> get order information from correios: " + trackingOrderNumber)

  const urlToFech = `https://linkcorreios.com.br/${trackingOrderNumber}`;

  let response = await axios.get(urlToFech, {
    "method": "GET",
    "headers": {
      'validateHttpsCertificates': false
    }
  });

  const textResponse = await response.data;

  const ordersArray = getStatusArray('<ul class="linha_status" style="">', textResponse)

  const dateOrderArrievedInBrazil = getDateByStatus(ordersArray, Array("Objeto recebido pelos Correios do Brasil"))
  const dateClearedByCustoms = getDateByStatus(ordersArray, Array("Fiscalização aduaneira finalizada"))
  const dateGoingToCustomerCity = getDateGoingToCity(ordersArray, customerCity)
  const dateArrivedInCustomerCity = getDateArrivedInCity(ordersArray, customerCity)
  const dateWaitingForPickup = getDateByStatus(ordersArray, Array("Objeto aguardando retirada no endereço indicado"))
  const dateOutForDelivery = getDateByStatus(ordersArray, Array("Objeto saiu para entrega ao destinatário"))
  const dateOrderDelivered = getDateByStatus(ordersArray, Array("Objeto entregue ao destinatário", "Objeto entregue ao remetente"))
  const dateErrorWhenDelivering = getDateByStatus(ordersArray, Array("Objeto não entregue - endereço incorreto", "Objeto não entregue - carteiro não atendido"))
  const dateOutOfDateDelivery = getDateByStatus(ordersArray, Array("Prazo de retirada pelo destinatário encerrado"))
  const dateGoingToChina = getDateByStatus(ordersArray, Array("Objeto encaminhado para fiscalização aduaneira de exportação"))
  const dateReturnedToChina = getDateByStatus(ordersArray, Array("Objeto devolvido ao país de origem"))

  const correiosObj = {
    dateOrderArrievedInBrazil,
    dateClearedByCustoms,
    dateGoingToCustomerCity,
    dateArrivedInCustomerCity,
    dateWaitingForPickup,
    dateOutForDelivery,
    dateOrderDelivered,
    dateErrorWhenDelivering,
    dateOutOfDateDelivery,
    dateGoingToChina,
    dateReturnedToChina
  }

  return correiosObj
}

/* ################################################################################################################################# */

function getStatusArray(textToFind, pageContent) { /* =============================================================== */

  if (!pageContent || !textToFind) { return }

  const splitArr = pageContent.split(textToFind)
  const statusNumber = splitArr.length

  let x = 1;

  let finalArray = [];

  while (x < statusNumber) {

    let currentStatus = pageContent.split(textToFind)[x];

    let str1_status = currentStatus.split('<li>Status: <b>')[1]
    str1_status = str1_status.split('</b></li>')[0].replace(" - por favor aguarde", "")

    let str1_data = currentStatus.split('<li>Data  : ')[1]
    str1_data = str1_data.split('</li>')[0]

    let str1_origem = currentStatus.split('<li>Origem: ')
    str1_origem = str1_origem.length > 1 ? str1_origem[1].split('</li>')[0] : "#";

    let str1_destino = currentStatus.split('<li>Destino: ')
    str1_destino = str1_destino.length > 1 ? str1_destino[1].split('</li>')[0] : "#";

    let statusArray = Array(str1_data, str1_status, str1_origem, str1_destino)

    if (x == 1) {
      finalArray = [statusArray];
    } else {
      finalArray = Array(...finalArray, statusArray)
    }
    x = x + 1;
  }

  return finalArray;

}

function getDateByStatus(orderStatus, statusToFindArr) { /* ========================================================= */

  if (orderStatus.length == 0) { return "#" }

  for (let x = 0; x < orderStatus.length; x++) {

    let currentStatus = orderStatus[x];

    let currentStatusDate = currentStatus[0].split("|")[0];
    let currentStatusName = currentStatus[1]

    if (statusToFindArr) {
      for (let y = 0; y < statusToFindArr.length; y++) {
        if (currentStatusName == statusToFindArr[y]) {
          return currentStatusDate;
        }
      }
    }

  }

  return "_";
}

function getDateGoingToCity(orderStatus, customerCity) { /* ========================================================= */

  if (orderStatus.length == 0) { return "#" }

  let fixedCustomerCity = removeAccents(customerCity.toLowerCase());

  for (let x = 0; x < orderStatus.length; x++) {

    let currentStatus = orderStatus[x];
    let currentStatusDate = currentStatus[0].split("|")[0];
    let currentStatusDestination = currentStatus[3].toLowerCase();

    if (currentStatusDestination.search(fixedCustomerCity) > -1) {
      return currentStatusDate;
    }

  }

  return "_";
}

function getDateArrivedInCity(orderStatus, customerCity) { /* ======================================================= */

  if (orderStatus.length == 0) { return "#" }

  let fixedCustomerCity = removeAccents(customerCity.toLowerCase());

  for (let x = 0; x < orderStatus.length; x++) {

    let currentStatus = orderStatus[x];

    let currentStatusDate = currentStatus[0].split("|")[0];
    let currentStatusOrigin = currentStatus[2].toLowerCase();

    if (currentStatusOrigin.search(fixedCustomerCity) > -1) {
      return currentStatusDate;
    }

  }

  return "_";
}

/* ################################################################################################################################# */

function removeAccents(strAccents: string): string { /* ============================================================================= */

  const strAccentsArr = strAccents.split('');
  const accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
  const accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";

  var strAccentsOut = new Array();

  for (var y = 0; y < strAccentsArr.length; y++) {
    if (accents.indexOf(strAccentsArr[y]) != -1) {
      strAccentsOut[y] = accentsOut.substring(accents.indexOf(strAccentsArr[y]), 1);
    } else {
      strAccentsOut[y] = strAccentsArr[y];
    }
  }

  return strAccentsOut.join('').toString();
}

/* ################################################################################################################################# */
