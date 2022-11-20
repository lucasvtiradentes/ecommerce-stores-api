import { NextFunction, Request, Response } from 'express';
import {
  LOGGER,
  CURRENT_DATETIME,
  SERVER_TOKEN
} from '../../..//configs/configs'

export default function validateRequests(req: Request, res: Response, next: NextFunction) {

  const { method, path, query } = req
  const token = query.token || "undefined";

  const isTokenCorrect = token === SERVER_TOKEN
  const isAllowedRoute = true; // path -> definir rotas que podem
  let userCanNavigate = true;  // colocar false pra precisar do TOKEN

  if (path === "/favicon.ico") { next(); return; }
  if (isAllowedRoute) {
    // console.log(`${path} was allowed due to valid Token`)
    next();
    return
  }

  if (!userCanNavigate) {
    const msgError = `${path} was not allowed due to invalid Token`
    console.log(msgError)
    res.status(404).json({ error: msgError });
    return;
  }

}
