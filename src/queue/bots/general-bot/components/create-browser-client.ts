import {
  GET_BOT_INFO
} from '../../../..//configs/configs'

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

export default async function createBrowserClient() {

  puppeteer.use(StealthPlugin())

  const customArgs = [
    '--start-maximized',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--unhandled-rejections=strict'
  ]

  const pupOptions = {
    headless: GET_BOT_INFO('GEN BOT').options.headless,
    args: customArgs,
    defaultViewport: {
      width:1115,
      height:625
    }
  };

  const browser = await puppeteer.launch(pupOptions);

  return browser
}
