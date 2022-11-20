import { Request, Response } from 'express'
import {IMPORT_MODULE, LOGGER} from '../../../../..//configs/configs'

import getUpdatedJob from '../../../../components/get-job-result'
import checkQueriesErros from '../../../../components/query-validation'

export default async function loginController(request: Request, response: Response) {

  const WORKERQUEUE = global['WORKERQUEUE']
  const { username, password } = request.query

  if (checkQueriesErros({ username, password }, response) === true) { return }
  let currentJob = await WORKERQUEUE.add({ method: "/api/aliexpress/login", ...request.query });

  getUpdatedJob(currentJob).then((updatedJob) => {
    response.json(updatedJob['returnvalue'])
  }).catch((errMessage) => {
    response.json({ jobResult: false, jobMessage: errMessage})
  })

}
