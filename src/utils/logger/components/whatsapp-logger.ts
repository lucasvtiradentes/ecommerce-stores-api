import fetchJsonUrl from "../../functions/fetch-json-url";

export default async function whatsappLogger(message){

  const serverBase = process.env.NODE_ENV === "production" ? "https://instigare-midia.herokuapp.com" : "http://localhost:3000"
  const whatsappLoggerUrl = `${serverBase}/api/whatsapp/logger?message=${message}`
  const serverResponse = await fetchJsonUrl(whatsappLoggerUrl)
  return serverResponse.jobResult

}
