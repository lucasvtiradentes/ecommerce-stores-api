import { Request, Response } from 'express';
import {IMPORT_MODULE, LOGGER} from '../../../../..//configs/configs'

import getUpdatedJob from '../../../../components/get-job-result'
import checkQueriesErros from '../../../../components/query-validation'

export default async function verificateCodeController(request: Request, response: Response) {

  const WORKERQUEUE = global['WORKERQUEUE']
  const { code } = request.query;
  if (checkQueriesErros({ code }, response) === true) { return }

  let currentJob = await WORKERQUEUE.add({ method: "/api/aliexpress/typecode", ...request.query });

  getUpdatedJob(currentJob).then((updatedJob) => {
    response.json(updatedJob['returnvalue'])
  }).catch((errMessage) => {
    response.json({ jobResult: false, jobMessage: errMessage })
  })

}
