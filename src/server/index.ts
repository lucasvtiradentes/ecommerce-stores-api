import cors from 'cors'
import express, { Express } from 'express'
import { join } from 'path'
import { existsSync } from 'fs'

import {
  SERVER_PORT,
  LOGGER,
  NODE_ENV,
  SERVER_BASE,
} from '..//configs/configs'

import getApiServer from "./api/api"

import newAccessMiddleware from './middlewares/new-access-middleware'
import homePageController from './pages/homepage/home-page-controller'
import setRoutesInExpressServer from './components/set-routes-in-server'
import getApiRoutes from './api/routes/api-routes'

export default function InitServer(): Express {

  let server = express()

  LOGGER(`Iniciando server`, { from: 'SERVER', pid: true })

  server.use(express.json({limit: '25mb'}));
  server.use(express.urlencoded({extended: true}));

  server.use(newAccessMiddleware)

  server.use(cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4000',
      'https://instigaremidia.com',
      'http://instigare-backup.herokuapp.com',
      'https://instigare-midia.herokuapp.com'
    ]
  }));

  server.use('/pages', express.static(join(__dirname, '/pages/')))
  server.get("/", homePageController);

  server = setRoutesInExpressServer(server, getApiRoutes('/api'))
  server.use('/api', getApiServer())

  server.get("*", (req, res) => {
    res.send("ROTA NÃO ENCONTRADA")
  });

  server.listen(SERVER_PORT, async () => {
    LOGGER(`Server ${SERVER_BASE} iniciado na porta ${SERVER_PORT}`, { from: 'SERVER', pid: true })
  }).setTimeout(0)

  return server

}
