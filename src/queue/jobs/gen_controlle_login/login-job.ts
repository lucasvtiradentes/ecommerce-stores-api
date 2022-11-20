import {
  LOGGER,
  IMPORT_MODULE
} from '../../..//configs/configs'

import completeJob from '../../components/completeJob'
import loginAtControlleDirect from './login-at-controlle'

export default async function loginAtControlleJob(job) {

  const {username, password} = job.data

  const GENBOT = global.WORKER['GENBOT']
  const CONPAGE = global['CONPAGE']
  if (!GENBOT) { return completeJob(false, "Cliente não está definido!") }

  await CONPAGE.bringToFront()

  try {
    const loginResult = await loginAtControlleDirect(CONPAGE, username, password)
    return completeJob(true, loginResult)
  } catch (error) {
    return completeJob(false, error.message)
  }

}
