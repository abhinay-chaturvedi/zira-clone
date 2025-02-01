import { Response } from "express";
import { CustomRequest } from "../lib/types";
import { config } from "../config";
import { ID, Query } from "node-appwrite";
import { multerToFile } from "../lib/multerToFile";
import { generateInviteCode, getMember } from "../lib/utils";

export const getWorkSpaces = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const databases = req.databases;
    const user = req.user;
    const members = await databases?.listDocuments(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_MEMBERS_ID,
      [Query.equal("userId", user?.$id!)]
    );
    if (members?.total === 0) {
      return res
        .status(200)
        .json({ success: true, data: { documents: [], total: 0 } });
    }
    const workspaceIds = members?.documents.map(
      (member): string => member.workspaceId
    );
    const workspaces = await databases?.listDocuments(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_WORKSPACES_ID,
      [Query.contains("$id", workspaceIds!), Query.orderDesc("$createdAt")]
    );
    res.status(200).json({ success: true, data: workspaces });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const createWorkSpace = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const databases = req.databases;
    const storage = req.storage;
    const user = req.user;
    const { name } = req.body;
    const image = req.file;
    // console.log(image, "image");
    let uploadedImageUrl: string | undefined;
    if (image) {
      let fileImage = multerToFile(image);
      const file = await storage?.createFile(
        config.APPWRITE_IMAGES_BUCKET_ID,
        ID.unique(),
        fileImage
      );
      console.log("hi there");
      const arrayBuffer = await storage?.getFilePreview(
        config.APPWRITE_IMAGES_BUCKET_ID,
        file?.$id!
      );
      uploadedImageUrl = `data:image/png;base64,${Buffer.from(
        arrayBuffer!
      ).toString("base64")}`;
    }
    // console.log(uploadedImageUrl?.length);
    const inviteCode = generateInviteCode(8);
    const workspace = await databases?.createDocument(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_WORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user?.$id,
        imageUrl: uploadedImageUrl,
        inviteCode: inviteCode,
      }
    );
    await databases?.createDocument(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_MEMBERS_ID,
      ID.unique(),
      {
        userId: user?.$id,
        workspaceId: workspace?.$id,
        role: "ADMIN",
      }
    );
    return res.status(201).json({ success: true, data: workspace });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ success: false, message: e.message });
  }
};
export const updateWorkspace = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const databases = req.databases;
    const storage = req.storage;
    const user = req.user;
    const { workspaceId } = req.params;
    const { name, imageUrl } = req.body;
    const image = req.file;
    const member = await getMember({
      databases,
      workspaceId,
      userId: user?.$id,
    });
    if (!member || member.role != "ADMIN") {
      return res.status(401).json({ success: true, message: "unauthorized" });
    }
    let uploadedImageUrl = imageUrl;
    if (image) {
      let fileImage = multerToFile(image);
      const file = await storage?.createFile(
        config.APPWRITE_IMAGES_BUCKET_ID,
        ID.unique(),
        fileImage
      );
      console.log("hi there");
      const arrayBuffer = await storage?.getFilePreview(
        config.APPWRITE_IMAGES_BUCKET_ID,
        file?.$id!
      );
      uploadedImageUrl = `data:image/png;base64,${Buffer.from(
        arrayBuffer!
      ).toString("base64")}`;
    }
    const workspace = await databases?.updateDocument(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_WORKSPACES_ID,
      workspaceId,
      {
        name,
        imageUrl: uploadedImageUrl,
      }
    );
    return res.status(200).json({ success: true, data: workspace });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
};
export const deleteWorkspace = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const { workspaceId } = req.params;
    const databases = req.databases;
    const user = req.user;
    const member = await getMember({
      databases,
      workspaceId,
      userId: user?.$id,
    });
    if (!member || member.role != "ADMIN") {
      return res.status(401).json({ success: false, message: "unauthorized" });
    }
    await databases?.deleteDocument(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_WORKSPACES_ID,
      workspaceId
    );
    return res.status(200).json({ success: true, data: { $id: workspaceId } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const resetInviteCode = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const { workspaceId } = req.params;
    const databases = req.databases;
    const user = req.user;
    const workspace = await databases?.updateDocument(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_WORKSPACES_ID,
      workspaceId,
      {
        inviteCode: generateInviteCode(8),
      }
    );
    return res.status(200).json({ success: true, data: workspace });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
export const handleJoinWorkspace = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const { code } = <{ code: string }>req.body;
    const { workspaceId } = req.params;
    const databases = req.databases;
    const user = req.user;
    const member = await getMember({
      databases,
      workspaceId,
      userId: user?.$id,
    });
    if (member) {
      return res
        .status(400)
        .json({ success: false, message: "Already a member" });
    }
    const workspace = await databases?.getDocument(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_WORKSPACES_ID,
      workspaceId
    );
    if (workspace && workspace.inviteCode != code) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid invite code" });
    }
    await databases?.createDocument(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_MEMBERS_ID,
      ID.unique(),
      {
        workspaceId,
        userId: user?.$id,
        role: "MEMBER",
      }
    );
    return res.status(200).json({ success: true, data: workspace});
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
