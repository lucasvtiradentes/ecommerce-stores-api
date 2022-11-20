import { Request, Response } from 'express';
import { IMPORT_MODULE } from '../../../../..//configs/configs'

import getUpdatedJob from '../../../../components/get-job-result'
import checkQueriesErros from '../../../../components/query-validation'

export default async function checkLoginController(request: Request, response: Response) {

  const WORKERQUEUE = global['WORKERQUEUE']
  let currentJob = await WORKERQUEUE.add({ method: "/api/aliexpress/checklogin" });

  getUpdatedJob(currentJob).then((updatedJob) => {
    response.json(updatedJob['returnvalue'])
  }).catch((errMessage) => {
    response.json({ jobResult: false, jobMessage: errMessage })
  })

}
