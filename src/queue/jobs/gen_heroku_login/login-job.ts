import {
  LOGGER,
  IMPORT_MODULE
} from '../../..//configs/configs'

import completeJob from '../../components/completeJob'
import loginAtHerokuDirect from './login-at-heroku'

export default async function loginAtHerokuJob(job) {

  const {username, password} = job.data

  const GENBOT = global.WORKER['GENBOT']
  const GENPAGE = global['GENPAGE']
  if (!GENBOT) { return completeJob(false, "Cliente não está definido!") }

  await GENPAGE.bringToFront()

  try {
    const loginResult = await loginAtHerokuDirect(GENPAGE, username, password)
    return completeJob(true, loginResult)
  } catch (error) {
    return completeJob(false, error.message)
  }

}
