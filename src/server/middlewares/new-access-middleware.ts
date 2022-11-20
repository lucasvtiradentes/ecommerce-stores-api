import { NextFunction, Request, Response } from "express";
import { LOGGER } from "../..//configs/configs"

export default function newAccessMiddleware(req: Request, res: Response, next: NextFunction) {

  req.connection.setTimeout( 1000 * 60 * 10 ); // ten minutes
  const fileExtensionsArr = ['ico', 'png', 'jpg', 'js', 'map', 'css']
  const splitUrl = req.originalUrl.split('.')
  const extension = splitUrl[splitUrl.length - 1]

  if (fileExtensionsArr.indexOf(extension) === -1) {
    const finalUrl = `--> ${req.originalUrl}` // ${req.protocol}://${req.get('host')}
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : ''
    if (token){
      LOGGER(finalUrl, { from: 'SERVER', pid: true })
      // console.log(token)
    }
  }

  next()

}
