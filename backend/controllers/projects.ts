import { Response } from "express";
import { CustomRequest } from "../lib/types";
import { getMember } from "../lib/utils";
import { config } from "../config";
import { ID, Query } from "node-appwrite";
import { multerToFile } from "../lib/multerToFile";

export const getProjectsInWorkspace = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const { workspaceId } = <{ workspaceId: string }>req.query;
    if (!workspaceId) {
      return res.status(400).json({ message: "Missing workspaceId" });
    }
    const databases = req.databases;
    const user = req.user;
    const member = await getMember({
      databases,
      workspaceId,
      userId: user?.$id,
    });
    if (!member) {
      return res.status(401).json({ message: "unauthorized" });
    }
    const projects = await databases?.listDocuments(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_PROJECTS_ID,
      [Query.equal("workspaceId", workspaceId), Query.orderDesc("$createdAt")]
    );
    return res.status(200).json({ data: projects });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
export const handleCreateProject = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const databases = req.databases;
    const storage = req.storage;
    const user = req.user;
    const { name, workspaceId } = req.body;
    console.log(req.body);
    const member = await getMember({
      databases,
      workspaceId,
      userId: user?.$id,
    });
    if (!member) {
      return res.status(401).json({ message: "unauthorized" });
    }
    const image = req.file;
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
    // const inviteCode = generateInviteCode(8);
    const workspace = await databases?.createDocument(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_PROJECTS_ID,
      ID.unique(),
      {
        name,
        imageUrl: uploadedImageUrl,
        workspaceId,
      }
    );

    return res.status(201).json({ success: true, data: workspace });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
export const handleUpdateProject = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const databases = req.databases;
    const storage = req.storage;
    const user = req.user;
    const { projectId } = <{ projectId: string }>req.params;
    const { name, imageUrl } = req.body;
    const image = req.file;

    const existingProject = await databases?.getDocument(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_PROJECTS_ID,
      projectId
    );
    if (!existingProject) {
      return res.status(400).json({ message: "Project does not exist." });
    }
    const member = await getMember({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user?.$id,
    });
    if (!member) {
      return res.status(401).json({ message: "unauthorized" });
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
    const project = await databases?.updateDocument(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_PROJECTS_ID,
      projectId,
      {
        name,
        imageUrl: uploadedImageUrl,
      }
    );
    return res.status(200).json({ success: true, data: project });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const handleDeleteProject = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const { projectId } = req.params;
    const databases = req.databases;
    const user = req.user;
    const existingProject = await databases?.getDocument(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_PROJECTS_ID,
      projectId
    );
    if (!existingProject) {
      return res
        .status(400)
        .json({ message: "No project available for deletion." });
    }
    const member = await getMember({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user?.$id,
    });
    if (!member) {
      return res.status(401).json({ message: "unauthorized" });
    }
    //TODO: Delete Tasks related to this particular project.
    await databases?.deleteDocument(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_PROJECTS_ID,
      projectId
    );
    return res.status(200).json({ data: { $id: projectId } });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
