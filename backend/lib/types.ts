import { Request } from "express";
import { 
    Models,
    type Account as AccountType,
    type Databases as DatabasesType,
    type Storage as StorageType,
 } from "node-appwrite";
export interface CustomRequest extends Request {
  account?: AccountType;
  databases?: DatabasesType;
  storage?: StorageType;
  user?: Models.User<Models.Preferences>;
}

