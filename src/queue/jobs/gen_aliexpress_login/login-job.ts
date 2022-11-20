import {
  LOGGER,
  IMPORT_MODULE
} from '../../..//configs/configs'

import completeJob from '../../components/completeJob'
import loginAtAliexpressDirect from './login-at-aliexpress'

export default async function loginAtAliexpress(job) {

  const {page, username, password} = job.data

  const GENBOT = global.WORKER['GENBOT']
  const ALIPAGE = global['ALIPAGE']

  if (!GENBOT) { return completeJob(false, "Cliente não está definido!") }

  await ALIPAGE.bringToFront()

  try {
    const loginResult = await loginAtAliexpressDirect(page, username, password)
    return completeJob(true, loginResult)
  } catch (error) {
    return completeJob(false, error.message)
  }

}
