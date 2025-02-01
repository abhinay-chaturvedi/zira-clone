import { NextFunction, Request, Response } from "express";
import { config } from "../config";
import { 
    Account,
    Client,
    Databases,
    Storage,
    Models,
    type Account as AccountType,
    type Databases as DatabasesType,
    type Storage as StorageType,
 } from "node-appwrite";
import { CustomRequest } from "../lib/types";


export const sessionMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const session = req.cookies[`${config.AUTH_COOKIE}`];
    if (!session) {
      return res.status(401).json({ message: "unauthorized" });
    }
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT!)
      .setSession(session);
    
    const account = new Account(client);
    const databases = new Databases(client);
    const storage = new Storage(client);
    const user = await account.get();
    req.account = account;
    req.databases = databases;
    req.storage = storage;
    req.user = user;
    next()
  } catch (e: any) {
    res.status(500).json({ message: e.massage });
  }
};
