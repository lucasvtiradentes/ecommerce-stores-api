import { Request, Response } from 'express';
import getApiRoutes from '../routes/api-routes'

export default function showAllApiRoutesController(req: Request, res: Response){

  const apiRoutes = getApiRoutes('/api')
  const fullUrl = req.protocol + '://' + req.get('host');

  let lastCategory = ""
  let allRoutesObj = {}
  let categoryObj = {}

  for (const curRoute of apiRoutes) {
    const [method, route, routeFunction] = curRoute

    const curRouteName = route.split("/")[3]
    const curCategory = route.slice(0, Number(route.length - curRouteName.length))
    const curLink = `${fullUrl}${route}`

    if (curCategory !== lastCategory && lastCategory !== "" ){
      allRoutesObj[lastCategory] = categoryObj
      categoryObj = {}
    }

    lastCategory = curCategory
    categoryObj[curRouteName] = curLink
  }

  allRoutesObj[lastCategory] = categoryObj
  res.json(allRoutesObj)

}
