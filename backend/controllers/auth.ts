import { Request, Response } from "express";
import { createAdminClient } from "../lib/appwrite";
import { ID } from "node-appwrite";
import { config } from "../config";
import { CustomRequest } from "../lib/types";

export const loginController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, password } = req.body;
    const { account } = await createAdminClient();
    // console.log(account, "account");
    const session = await account.createEmailPasswordSession(email, password);
    // console.log(JSON.stringify(session), "session");
    res.cookie(config.AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res
      .status(200)
      .json({ message: "successfully login!", success: true });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const registerController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name, email, password } = req.body;
    const { account } = await createAdminClient();
    const user = await account.create(ID.unique(), email, password, name);
    const session = await account.createEmailPasswordSession(email, password);
    res.cookie(config.AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res
      .status(200)
      .json({ success: true, message: "successfully registered!" });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
export const logoutController = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    res.clearCookie(config.AUTH_COOKIE);
    // console.log(JSON.stringify(req.cookies))
    const account = req.account;
    await account?.deleteSession("current");

    return res
      .status(200)
      .json({ success: true, message: "logout successfully!" });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
};
export const currentUser = async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const user = req.user;
    return res.status(200).json({ success: true, data: user });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.massage });
  }
};
