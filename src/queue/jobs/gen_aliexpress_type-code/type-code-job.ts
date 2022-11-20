import {
  LOGGER,
  IMPORT_MODULE
} from '../../..//configs/configs'

import completeJob from '../../components/completeJob'

export default async function verificateCodeAliexpress(job) {

  const { code } = job.data

  const GENBOT = global.WORKER['GENBOT']
  const ALIPAGE = global['ALIPAGE']
  if (!GENBOT) { return completeJob(false, "Cliente não está definido!") }

  await ALIPAGE.bringToFront()

  try {

    if (!ALIPAGE) { return completeJob(false, "Página não encontrado!") }

    var frames = await ALIPAGE.frames();

    const codeFrame = frames.find((curFrame) => {
      if (curFrame._url.toString().search('identity_verify') > 0) {
        console.log(curFrame._url)
        return true
      }
    });

    if (!codeFrame) { return completeJob(false, "Frame não encontrado!") }

    const context = await codeFrame.executionContext();

    const res = await context.evaluate(() => {
      const el = document.querySelector("*");
      if (el) return el.outerHTML;
    });

    await codeFrame.evaluate((codeToPut) => {
      const elPass = document.querySelector("#J_Checkcode") as HTMLInputElement | null;
      if (elPass) {
        elPass.value = codeToPut
      }
    }, code)

    await codeFrame.evaluate(() => {
      const elSubmit = document.querySelector('div.submit > button') as HTMLInputElement | null;
      if (elSubmit) {
        elSubmit.click()
      }
    });

    return completeJob(true, "Código inserido corretamente")

  } catch (error) {
    return completeJob(false, error.message)
  }

}
