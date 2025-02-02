import { Response } from "express";
import { CustomRequest } from "../lib/types";
import { getMember } from "../lib/utils";
import { config } from "../config";
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../lib/appwrite";

export const handleCreateTask = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    console.log("hi there", req.body)
    const user = req.user;
    const databases = req.databases;
    if (!databases)
      return res.status(500).json({ message: "Someting went wrong" });
    const { name, status, workspaceId, projectId, dueDate, assigneeId } =
      req.body;
    const member = await getMember({
      databases,
      workspaceId,
      userId: user?.$id,
    });
    if (!member) return res.status(401).json({ message: "unauthorized" });
    const highestPositionTask = await databases?.listDocuments(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_TASKS_ID,
      [
        Query.equal("status", status),
        Query.equal("workspaceId", workspaceId),
        Query.orderAsc("position"),
        Query.limit(1),
      ]
    );
    const newPosition =
      highestPositionTask?.documents.length > 0
        ? highestPositionTask?.documents[0].position
        : 1000;
    const task = await databases.createDocument(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_TASKS_ID,
      ID.unique(),
      {
        name,
        status,
        workspaceId,
        projectId,
        dueDate,
        assigneeId,
        position: newPosition,
      }
    );
    return res.status(201).json({ data: task });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
export const getTask = async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const { users } = await createAdminClient();
    const databases = req.databases;
    const user = req.user;
    const { workspaceId, projectId, status, search, assigneeId, dueDate } = <
      any
    >req.query;
    const member = await getMember({
      databases,
      workspaceId,
      userId: user?.$id,
    });
    if (!member) {
      return res.status(401).json({ message: "unauthorized" });
    }
    const query = [
      Query.equal("workspaceId", workspaceId),
      Query.orderDesc("$createdAt"),
    ];
    if (projectId) {
      console.log("projectId:", projectId);
      query.push(Query.equal("projectId", projectId));
    }
    if (status) {
      console.log("status:", status);
      query.push(Query.equal("status", status));
    }
    if (assigneeId) {
      console.log("assigneeId:", assigneeId);
      query.push(Query.equal("assigneeId", assigneeId));
    }
    if (dueDate) {
      console.log("dueData:", dueDate);
      query.push(Query.equal("dueDate", dueDate));
    }
    if (search) {
      console.log("search:", search);
      query.push(Query.search("name", search));
    }
    const tasks = await databases?.listDocuments(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_TASKS_ID,
      query
    );
    if (!tasks) return res.status(400).json({ message: "no tasks found" });
    const projectIds = tasks?.documents.map((task) => task.projectId);
    
    const assigneeIds = tasks.documents.map((task) => task.assigneeId);

    const projets = await databases?.listDocuments(
        config.APPWRITE_DATABASE_ID,
        config.APPWRITE_PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      );
      const members = await databases?.listDocuments(
        config.APPWRITE_DATABASE_ID,
        config.APPWRITE_MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
      );
      if(!members)  return res.status(500).json({message: "issue in finding the members"});
      const assignees = await Promise.all(members?.documents.map(async (member) => {
        const user = await users.get(member.userId)
        return {
            ...member,
            name: user.name,
            email: user.email
        }
      }))
      const populatedTasks = tasks.documents.map((task) => {
        const project = projets?.documents.find((project) => project.$id === task.projectId);
        const assignee = assignees?.find((assignee) => assignee.$id === task.assigneeId);
        return {
            ...task,
            project,
            assignee
        }
      })
    return res.status(200).json({ data: {
        ...tasks,
        documents: populatedTasks
    } });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
