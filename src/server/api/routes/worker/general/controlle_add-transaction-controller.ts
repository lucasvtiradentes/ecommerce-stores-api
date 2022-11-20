import { Request, Response } from 'express'
import {IMPORT_MODULE, LOGGER} from '../../../../..//configs/configs'

import getUpdatedJob from '../../../../components/get-job-result'
import checkQueriesErros from '../../../../components/query-validation'

export default async function addTransactionController(request: Request, response: Response) {

  const WORKERQUEUE = global['WORKERQUEUE']
  const { value, category, type, date, description } = request.query

  if (checkQueriesErros({ value, category, type, date, description }, response) === true) { return }
  let currentJob = await WORKERQUEUE.add({ method: "/api/controlle/addtransaction", ...request.query });

  getUpdatedJob(currentJob).then((updatedJob) => {
    response.json(updatedJob['returnvalue'])
  }).catch((errMessage) => {
    response.json({ jobResult: false, jobMessage: errMessage})
  })

}
