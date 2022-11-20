import {
  LOGGER,
  DATABASE_LOGIN_URL
} from './configs/configs'

import {initMongoClient} from './utils/libraries/mongodb'

export default async function connectDatabase() {

  const db_options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

  const client = await initMongoClient(DATABASE_LOGIN_URL, db_options);

  if (client){
    LOGGER(`Banco de dados conectado`, {from: 'DTBASE' ,pid: true})
    return client
  } else {
    LOGGER(`Não foi possível conectar ao banco de dados`, {from: 'DTBASE' ,pid: true})
    return false
  }

}
