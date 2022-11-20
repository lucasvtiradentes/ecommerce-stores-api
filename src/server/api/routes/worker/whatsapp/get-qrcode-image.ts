import { Request, Response } from 'express'
import {
  IMPORT_MODULE,
  LOGGER,
  DATABASE_DATABASE_GENERAL,
  DATABASE_COLLECTION_VARIABLES
} from '../../../../..//configs/configs'

import { findObjInCollection } from '../../../../..//utils/libraries/mongodb'

export default async function getQrcodeJson(request: Request, response: Response) {
  const DBCLIENT = global['DBCLIENT']
  const qrcode = await findObjInCollection(DBCLIENT, DATABASE_DATABASE_GENERAL, DATABASE_COLLECTION_VARIABLES, { objName: 'QR_CODE' })
  response.json(qrcode)
}
