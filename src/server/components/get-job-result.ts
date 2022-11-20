import {
  SERVER_JOB_SECONDS,
  LOGGER
} from '../..//configs/configs'

export default function getjobResult(currentJob) {

  const WORKERQUEUE = global['WORKERQUEUE']

  return new Promise(function (fulfilled, rejected) {

    let timeChecked = 0;

    LOGGER(`new job: ${currentJob.id} | ${currentJob.data.method} | waiting for ${SERVER_JOB_SECONDS}s info from worker`, {from: 'SERVER', pid: true})
    if (Object.keys(currentJob.data).length > 1){
      const tmpObj = currentJob.data
      delete tmpObj['method'];
      LOGGER(`${JSON.stringify(tmpObj)}`, {from: 'SERVER', pid: true})
    }

    const setIntervalDef = setInterval(async () => {

      timeChecked = timeChecked + 1

      let jobToCheck = await WORKERQUEUE.getJob(currentJob.id);

      if (jobToCheck === null) {
        jobDone(false, "Erro ao realizar tarefa")
      } else if (timeChecked > SERVER_JOB_SECONDS) {
        jobDone(false, "Tempo de espera foi ultrapassado!")
      } else {
        let state = await jobToCheck.getState();
        // console.log(timeChecked + " -> " + state)
        if (state == "completed") {
          jobDone(true, jobToCheck)
        } else if (state == "failed") {
          jobDone(true, jobToCheck)
        }
      }

      function jobDone(result, msg) {
        clearInterval(setIntervalDef)

        if (result === true) { fulfilled(msg) }
        else { rejected(msg) }

      }

    }, 1000);

  })


}
