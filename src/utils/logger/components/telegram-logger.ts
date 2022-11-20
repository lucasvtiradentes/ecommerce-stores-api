import fetchJsonUrl from "../../functions/fetch-json-url";

export default async function telegramLogger(message: string){

  try{

    const serverBase = process.env.NODE_ENV === "production" ? process.env.BASE_URL : "http://localhost:4000"
    const telegramLoggerUrl = `${serverBase}/api/telegram/logger?message=${message}`
    const serverResponse = await fetchJsonUrl(telegramLoggerUrl)
    return serverResponse.jobResult

  }catch(e){
    console.log(e.message)
    return false
  }
}
