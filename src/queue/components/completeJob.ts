interface IJobResult {
  result: boolean,
  message: any
}

export default function completeJob(jobResult: boolean, jobMessage: any): IJobResult{

  const jobResultObj = {
    result: jobResult,
    message: jobMessage
  }

  return jobResultObj
}
