import { Router } from 'express'

import showAllApiRoutesController from './pages/show-all-api-routes-controller';

export default function getDropmaxServer() {

  const router = Router();

  router.get("/", showAllApiRoutesController);

  return router

}
