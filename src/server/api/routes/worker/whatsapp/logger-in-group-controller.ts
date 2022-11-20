import { Request, Response } from 'express';
import {
  IMPORT_MODULE,
  LOGGER
} from '../../../../..//configs/configs'

import getUpdatedJob from '../../../../components/get-job-result'
import checkQueriesErros from '../../../../components/query-validation'

export default async function loggerController(request: Request, response: Response) {

  const WORKERQUEUE = global['WORKERQUEUE']
  const { message } = request.query;

  if (checkQueriesErros({ message }, response) === true) { return }
  let currentJob = await WORKERQUEUE.add({ method: "/api/whatsapp/logger", ...request.query });

  getUpdatedJob(currentJob).then((updatedJob) => {
    response.json(updatedJob['returnvalue'])
  }).catch((errMessage) => {
    response.json({ jobResult: false, jobMessage: errMessage })
  })

}
