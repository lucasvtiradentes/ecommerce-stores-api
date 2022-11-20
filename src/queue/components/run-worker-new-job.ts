import {
  IMPORT_MODULE,
  LOGGER
} from '../..//configs/configs'

import getWorkerRoutes from '../jobs/worker-routes';

export default async function runWorkerNewJob(job, done) {

  try {

    const { method } = job.data;
    LOGGER(`${job.id} | JOB INICIADO: ${method}`, { from: 'QUEUE', pid: true })

    const routes = await getWorkerRoutes()
    const methodsArr = routes.map(elArr => elArr[0])
    const indexOfMethod = methodsArr.indexOf(method)

    if (indexOfMethod === -1) {
      LOGGER(`${job.id} | ${method} não foi encontrado`, { from: 'QUEUE', pid: true })
      done(null, { jobResult: false, jobMessage: "Método não encontrado" });
      return;
    }

    const methodArr = routes[indexOfMethod]
    const methodFunction = methodArr[1] as any

    const resultObj = await methodFunction(job)

    if (typeof resultObj != "object") {
      LOGGER(`${job.id} | JOB FINALIZADO | ERRO 1`, { from: 'QUEUE', pid: true })
      done(null, { jobResult: false, jobMessage: "Outro erro" });
      return;
    }

    const { result, message } = resultObj
    LOGGER(`${job.id} | JOB FINALIZADO | SUCESSO`, { from: 'QUEUE', pid: true })
    done(null, { jobResult: result, jobMessage: message });

  } catch (error) {
    LOGGER(`${job.id} | JOB FINALIZADO | ERRO 2`, { from: 'QUEUE', pid: true })
    done(null, { jobResult: false, jobMessage: error.message });
  }

}
