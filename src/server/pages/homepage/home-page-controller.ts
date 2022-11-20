import { Request, Response } from "express";
import { join } from "path";

export default async function homePageController(req: Request, res: Response){
  res.sendFile(join(__dirname, 'homepage.html'));
}
