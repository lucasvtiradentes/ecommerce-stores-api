import { Request, Response } from 'express';
import { IMPORT_MODULE, LOGGER } from '../../../../..//configs/configs'

import getUpdatedJob from '../../../../components/get-job-result'
import checkQueriesErros from '../../../../components/query-validation'

export default async function loggerInGroupController(request: Request, response: Response) {

  const WORKERQUEUE = global['WORKERQUEUE']
  const { image } = request.body;
  console.log(image)
  console.log(image.data)

  if (checkQueriesErros({ image }, response) === true) { return }
  let currentJob = await WORKERQUEUE.add({ method: "/api/telegram/image", ...request.body });

  getUpdatedJob(currentJob).then((updatedJob) => {
    response.json(updatedJob['returnvalue'])
  }).catch((errMessage) => {
    response.json({ jobResult: false, jobMessage: errMessage })
  })

}
