/* ################################################################################################################################# */

export default function formatShopifyOrderObject(shopifyObj, queryObj) {
  
  const orderDate = getOrderDate(shopifyObj)
  const orderNumber = getOrderNumber(shopifyObj)
  const orderHour = getOrderHour(shopifyObj)

  // orderMonth
  // orderDay
  // orderWeekDay

  const orderCustomerProductName = getOrderCustomerProductName(shopifyObj)
  const orderShippimentMethod = getOrderShippimentMethod(shopifyObj)

  const orderCustomerName = getOrderCustomerName(shopifyObj)
  const orderCustomerPhone = getOrderCustomerPhone(shopifyObj)
  const orderCustomerEmail = getOrderCustomerEmail(shopifyObj)
  const orderCustomerIdentityDocument = getOrderCustomerIdentityDocument(shopifyObj)
  const orderCustomerState = getOrderCustomerState(shopifyObj)
  const orderCustomerCity = getOrderCustomerCity(shopifyObj)

  const orderUtmSource = "#"
  const orderUtmMedium = "#"
  const orderUtmCampaign = "#"
  const orderUtmContent = "#"
  const orderUtmTerm = "#"

  const orderStoreHostName = "Shopify"
  const orderHostTrackNumber = getOrderHostTrackNumber(shopifyObj)
  const orderFollowUpLink = getOrderFollowUpLink(shopifyObj)
  const orderToken = getOrderToken(shopifyObj)

  const orderCheckoutName = getCheckoutName(shopifyObj)
  const orderCheckoutTrackNumber = getCheckoutTrackNumber(shopifyObj)

  const orderGatewayName = getGatewayName(shopifyObj)
  const orderGatewayTrackNumber = getGatewayTrackNumber(shopifyObj)
  const orderPendingCode = getOrderPendingCode(shopifyObj)
  const orderPendingLink = getOrderPendingLink(shopifyObj)

  const orderApiLink = getOrderApiLink(orderNumber, queryObj)
  const orderAliexpressTrackNumber = getOrderAliexpressTrackNumber(shopifyObj)

  const orderCorreiosTrackNumber = getOrderCorreiosTrackNumber(shopifyObj)
  // dateOrderArrievedInBrazil
  // dateClearedByCustoms
  // dateGoingToCustomerCity
  // dateArrivedInCustomerCity
  // dateWaitingForPickup
  // dateOutForDelivery
  // dateOrderDelivered
  // dateErrorWhenDelivering
  // dateOutOfDateDelivery
  // dateGoingToChina
  // dateReturnedToChina

  const orderProductPrice = getOrderProductPrice(shopifyObj)
  const orderProductDiscount = getOrderProductDiscount(shopifyObj)
  // orderProductCost

  // orderCheckoutTax
  // orderGatewayTax
  // orderInvoiceTax
  // orderTotalTax
  // orderContributionMargin
  // orderTheoricalProfit
  // orderRealProfit

  const orderPaymentMethod = getOrderPaymentMethod(shopifyObj)
  const orderFulfillmentStatus = getOrderFulfillmentStatus(shopifyObj)
  const orderPaymentStatus = getOrderPaymentStatus(shopifyObj)

  // orderIsRealOrder
  // orderStatus
  // orderDeliveryStatus
  // orderDeliveryForecast
  // orderEstimatedDeliveryDate

  // orderPendingMessage
  // orderTrackMessage
  // orderOutForDeliveryMessage
  // orderErrorWhenDeliveringMessage

  // orderFiscalNote
  // orderNewCorreiosTrackNumber
  // orderCustomerProductId
  // orderMessage
  // orderReplacedNumber

  // orderReplacedOrderType
  // orderIsSpecialOrder
  // orderFinish

  const shopifyFinalObj = {
    orderNumber,
    orderDate,
    orderHour,

    orderCustomerProductName,
    orderShippimentMethod,

    orderCustomerName,
    orderCustomerPhone,
    orderCustomerEmail,
    orderCustomerIdentityDocument,
    orderCustomerState,
    orderCustomerCity,

    orderUtmSource,
    orderUtmMedium,
    orderUtmCampaign,
    orderUtmContent,
    orderUtmTerm,

    orderStoreHostName,
    orderHostTrackNumber,
    orderFollowUpLink,
    orderToken,

    orderCheckoutName,
    orderCheckoutTrackNumber,

    orderGatewayName,
    orderGatewayTrackNumber,
    orderPendingCode,
    orderPendingLink,

    orderApiLink,
    orderAliexpressTrackNumber,

    orderCorreiosTrackNumber,

    orderProductPrice,
    orderProductDiscount,

    orderPaymentMethod,
    orderFulfillmentStatus,
    orderPaymentStatus,
  };

  return shopifyFinalObj;

}

/* ################################################################################################################################# */

function getOrderDate(orderInfo) { /* =============================================================================== */

  let dia = "#"
  let mes = "#"
  let ano = "#"

  if (orderInfo.created_at) {
    dia = orderInfo.created_at.substring(8, 10)
    mes = orderInfo.created_at.substring(5, 7)
    ano = orderInfo.created_at.substring(0, 4);
  }

  return dia + "/" + mes + "/" + ano
}

function getOrderHour(orderInfo) { /* =============================================================================== */

  let hour = "#"

  if (orderInfo.created_at) {
    hour = orderInfo.created_at.substring(11, 13)
  }

  return hour
}

function getOrderNumber(orderInfo) { /* ============================================================================= */
  return orderInfo.order_number;
}

function getOrderCorreiosTrackNumber(orderInfo) { /* ================================================================ */

  let trackingNumber = "#";

  if (orderInfo.fulfillments) {
    if (orderInfo.fulfillments.length == 1) {
      trackingNumber = orderInfo.fulfillments[0] ? orderInfo.fulfillments[0].tracking_number : "_";
    } else {

      for (let x = 0; x < orderInfo.fulfillments.length; x++) {
        if (orderInfo.fulfillments[x].tracking_number) {
          trackingNumber = orderInfo.fulfillments[x].tracking_number;
          break;
        }
      }
    }
  }

  return trackingNumber;

}

function getOrderHostTrackNumber(orderInfo) { /* ===================================================================== */
  return orderInfo.id
}

function getOrderPendingCode(orderInfo) { /* ======================================================================== */

  let orderPendingPaymentCode = "#";

  if (orderInfo.note_attributes) {
    orderInfo.note_attributes.forEach(item => {
      if (item.name == "Pix Code" || item.name == "Boleto Code") {
        orderPendingPaymentCode = item.value;
      }
    })
  }

  return orderPendingPaymentCode;

}

function getOrderPendingLink(orderInfo) { /* ======================================================================== */

  let orderPendingPaymentLink = "#";

  if (orderInfo.note_attributes) {
    orderInfo.note_attributes.forEach(item => {
      if ((item.name == "Boleto URL" || item.name == "URL Boleto") && item.value != "no_url") {
        orderPendingPaymentLink = item.value;
      }
    })
  }

  return orderPendingPaymentLink;

}

function getOrderFollowUpLink(orderInfo) { /* ======================================================================= */
  return orderInfo.order_status_url;
}

function getOrderToken(shopifyObj) { /* ============================================================================== */
  return shopifyObj.token
}

function getCheckoutName(shopifyObj) { /* =========================================================================== */

  let checkoutName = ""

  var tmpname = (shopifyObj.note)

  if (tmpname && tmpname.search("Yampi") > -1) {
    checkoutName = "Yampi"
  }

  return checkoutName

}

function getCheckoutTrackNumber(shopifyObj) { /* ===================================================================== */

  let trackNumber = ""

  var tmpname = (shopifyObj.note)

  if (tmpname && tmpname.search("Yampi") > -1) {
    trackNumber = shopifyObj.note.length > 0 ? (shopifyObj.note).split(" ")[2] : ""
  }

  return trackNumber


}


function getGatewayName(shopifyObj) { /* ============================================================================= */

  let gatewayName = ""

  if ((shopifyObj.payment_gateway_names).indexOf("Mercadopago") > -1) {
    gatewayName = "Mercadopago"
  }

  if ((shopifyObj.payment_gateway_names).indexOf("Appmax") > -1) {
    gatewayName = "Appmax"
  }

  return gatewayName
}

function getGatewayTrackNumber(shopifyObj) { /* ====================================================================== */

  let gatewayTrackNumber = "#"

  if ((shopifyObj.payment_gateway_names).indexOf("Mercadopago") > -1) {

    gatewayTrackNumber = getOrderPendingLink(shopifyObj)

    if (gatewayTrackNumber !== "#") {
      gatewayTrackNumber = gatewayTrackNumber.split("https://www.mercadopago.com.br/payments/")[1]
      gatewayTrackNumber = gatewayTrackNumber.split("/")[0]
    }

  }

  return gatewayTrackNumber

}

function getOrderApiLink(orderNumber, queryObj) { /* ================================================================= */

  const { shopifyLink, shopifyUsername, shopifyPassword, token } = queryObj

  const apiLink = "https://instigaremidia.com/api"
  const path = "store/getorderinfo_shopify"
  const queries = `?formatResult=true&shopifyLink=${shopifyLink}&shopifyUsername=${shopifyUsername}&shopifyPassword=${shopifyPassword}&orderNumber=${orderNumber}`
  const finalUrl = `${apiLink}/${path}/${queries}`

  return finalUrl
}

function getOrderAliexpressTrackNumber(orderInfo) { /* ============================================================== */

  let aliexpressOrder = "#"

  if (orderInfo.note_attributes) {
    for (var i = 0; i < orderInfo.note_attributes.length; i++) {

      let replacedName = orderInfo.note_attributes[i].name.replace(/Aliexpress Order # /gi, "");

      if (replacedName.length < orderInfo.note_attributes[i].name.length) {
        aliexpressOrder = replacedName
      }
    }

  }

  return aliexpressOrder;

}

function getOrderPaymentMethod(orderInfo) { /* ====================================================================== */

  let paymentMethod;

  if (orderInfo && orderInfo.tags) {
    if (orderInfo.tags.replace("Cartão de crédito", "#").length < orderInfo.tags.length || orderInfo.tags.replace("cc", "#").length < orderInfo.tags.length) {
      paymentMethod = "Cartão de crédito";
    } else if (orderInfo.tags.replace("Pix", "#").length < orderInfo.tags.length || orderInfo.tags.replace("pix", "#").length < orderInfo.tags.length) {
      paymentMethod = "Pix";
    } else if (orderInfo.tags.replace("Boleto", "#").length < orderInfo.tags.length || orderInfo.tags.replace("boleto", "#").length < orderInfo.tags.length) {
      paymentMethod = "Boleto";
    }
  }

  return paymentMethod;

}

function getOrderFulfillmentStatus(orderInfo) { /* ================================================================== */

  let fulfillmentStatus = ""
  fulfillmentStatus = orderInfo.fulfillment_status ? "Processado" : "Não processado";

  return fulfillmentStatus;
}

function getOrderPaymentStatus(orderInfo) { /* ====================================================================== */

  let payStatus = "#"

  if (orderInfo.financial_status) {
    payStatus = orderInfo.financial_status
    payStatus = payStatus.replace("pending", "Pendente")
    payStatus = payStatus.replace("paid", "Pago")
  }

  return payStatus

}

function getOrderShippimentMethod(orderInfo) { /* =================================================================== */

  let shippingMethod = "#"

  if (orderInfo.shipping_lines) {
    shippingMethod = orderInfo.shipping_lines[0] ? orderInfo.shipping_lines[0].code : "#"
  }

  return shippingMethod
}

function getOrderCustomerName(orderInfo) { /* ======================================================================= */

  let name = "#"

  if (orderInfo.customer) {
    name = orderInfo.customer.first_name + " " + orderInfo.customer.last_name;
  }

  return name
}

function getOrderCustomerPhone(orderInfo) {  /* ===================================================================== */
  return "55" + orderInfo.customer?.default_address?.phone.toString().replace(/[ +-]/g, '');
}

function getOrderCustomerEmail(orderInfo) { /* ====================================================================== */
  return orderInfo.contact_email;
}

function getOrderCustomerIdentityDocument(orderInfo) { /* =========================================================== */
  return orderInfo.shipping_address?.company
}

function getOrderCustomerState(orderInfo) {  /* ===================================================================== */
  return orderInfo.billing_address?.province;
}

function getOrderCustomerCity(orderInfo) { /* ======================================================================= */
  if (orderInfo.billing_address) {
    return orderInfo.billing_address?.city;
  } else {
    return '#'
  }

}

function getOrderCustomerProductName(orderInfo) { /* ================================================================ */

  let orderProduct = "#"

  if (orderInfo.line_items) {

    if (orderInfo.line_items[0]) {
      orderProduct = orderInfo.line_items[0].title
    } else {
      if (orderInfo.fulfillments[0]) {
        if (orderInfo.fulfillments[0].line_items[0]) {
          orderProduct = orderInfo.fulfillments[0].line_items[0].name
        } else {
          orderProduct = "#"
        }
      } else {
        orderProduct = "#"
      }
    }

  }

  return orderProduct

}

function getOrderProductPrice(orderInfo) { /* ======================================================================= */
  return orderInfo.current_total_price.replace(".", ",");
}

function getOrderProductDiscount(orderInfo) { /* ==================================================================== */
  return orderInfo.current_total_discounts.replace(".", ",");
}

/* ################################################################################################################################# */
