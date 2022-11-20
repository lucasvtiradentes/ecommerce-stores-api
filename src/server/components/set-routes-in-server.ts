import { Express, NextFunction, Request, Response } from "express";

export default function setRoutesInExpressServer(server: Express, routesArr: any): Express{

  for (const curRoute of routesArr) {

    const [method, route, controller] = curRoute
    const defaultMiddleware = (req: Request, res: Response, next: NextFunction) => next()
    const finalMiddleWare = controller.length > 1 ? controller[1] : defaultMiddleware

    switch(method) {
      case 'get':
        server.get(route, finalMiddleWare, controller[0])
        break;
      case 'post':
        server.post(route, finalMiddleWare, controller[0])
        break;
      case 'put':
        server.put(route, finalMiddleWare, controller[0])
        break;
      case 'delete':
        server.delete(route, finalMiddleWare, controller[0])
        break;
      default:
        // code block
    }
  }

  return server
}
