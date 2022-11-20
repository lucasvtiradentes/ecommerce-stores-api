import { Response } from "express";

export default function checkQueriesErros(queryObj: any, response: Response): boolean {

  let hasError = false;
  let undefinedKeys = {}

  for (var [key, value] of Object.entries(queryObj)) {
    if (!value) {
      undefinedKeys[key] = value
      hasError = true
    }
  }

  if (hasError) {
    response.json({
      error: "need to set one or more url queries!",
      undefinedKeys: Object.keys(undefinedKeys),
      allParameters: Object.keys(queryObj)
    })
    return true;
  }

  return false
}
