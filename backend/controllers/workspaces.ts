import { Response } from "express";
import { CustomRequest } from "../lib/types";
import { config } from "../config";
import { ID, Query } from "node-appwrite";
import { multerToFile } from "../lib/multerToFile";
import { generateInviteCode, getMember } from "../lib/utils";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

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

export const handleWorkspaceAnalytics = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const databases = req.databases;
    if (!databases) {
      return res.status(500).json({ message: "Database not found" });
    }
    const user = req.user;
    const { workspaceId } = <{ workspaceId: string }>req.params;
    
    const member = await getMember({
      databases,
      workspaceId,
      userId: user?.$id,
    });
    if (!member) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));
    const thisMonthTasks = await databases?.listDocuments(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );
    const lastMonthTasks = await databases?.listDocuments(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );
    const taskCount = thisMonthTasks?.total;
    const taskDifference = taskCount - lastMonthTasks?.total;
    const thisMonthAssignedTasks = await databases.listDocuments(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );
    const lastMonthAssignedTasks = await databases.listDocuments(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );
    const assignedTaskCount = thisMonthAssignedTasks.total;
    const assignedTaskDifference =
      assignedTaskCount - lastMonthAssignedTasks.total;

    const thisMonthIncompleteTasks = await databases.listDocuments(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", "DONE"),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );
    const lastMonthIncompleteTasks = await databases.listDocuments(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", "DONE"),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );
    const incompleteTaskCount = thisMonthIncompleteTasks.total;
    const incompleteTaskDifference =
      incompleteTaskCount - lastMonthIncompleteTasks.total;

    const thisMonthCompletedTasks = await databases.listDocuments(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", "DONE"),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );
    const lastMonthCompletedTasks = await databases.listDocuments(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", "DONE"),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );
    const completedTaskCount = thisMonthCompletedTasks.total;
    const completedTaskDifference =
      completedTaskCount - lastMonthCompletedTasks.total;

    const thisMonthOverdueTasks = await databases.listDocuments(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", "DONE"),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );
    const lastMonthOverdueTasks = await databases.listDocuments(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", "DONE"),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );
    const overdueTaskCount = thisMonthOverdueTasks.total;
    const overdueTaskDifference =
      overdueTaskCount - lastMonthOverdueTasks.total;
    return res.status(200).json({
      data: {
        taskCount,
        taskDifference,
        assignedTaskCount,
        assignedTaskDifference,
        completedTaskCount,
        completedTaskDifference,
        incompleteTaskCount,
        incompleteTaskDifference,
        overdueTaskCount,
        overdueTaskDifference,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};