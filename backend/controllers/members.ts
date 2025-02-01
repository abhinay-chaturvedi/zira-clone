import { Response } from "express";
import { CustomRequest } from "../lib/types";
import { createAdminClient } from "../lib/appwrite";
import { getMember } from "../lib/utils";
import { config } from "../config";
import { Query } from "node-appwrite";

export const getMembersInWorkspace = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const { users } = await createAdminClient();
    const databases = req.databases;
    const user = req.user;
    const { workspaceId } = <{ workspaceId: string }>req.query;
    // if(!workspaceId) {
    //     return res.status(400).json({success: false, message: "workspaceId is required"})
    // }
    const member = await getMember({
      databases,
      workspaceId,
      userId: user?.$id,
    });
    if (!member)
      return res.status(401).json({ success: false, message: "unauthorized" });
    const members = await databases?.listDocuments(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_MEMBERS_ID,
      [Query.equal("workspaceId", workspaceId)]
    );
    if (!members)
      return res.status(401).json({ success: false, message: "no members" });
    const populatedMembers = await Promise.all(
      members?.documents.map(async (member) => {
        const user = await users.get(member.userId);
        return {
          ...member,
          name: user.name,
          email: user.email,
        };
      })
    );
    return res.status(200).json({
      success: true,
      data: { ...members, documents: populatedMembers },
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ success: false, message: err.message, data: "" });
  }
};
export const deleteMemberFromWorkspace = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const databases = req.databases;
    const user = req.user;
    const { memberId } = req.params;
    const memberToDelete = await databases?.getDocument(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_MEMBERS_ID,
      memberId
    );
    if (!memberToDelete)
      return res
        .status(400)
        .json({ success: false, message: "No member to delete" });
    const member = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user?.$id,
    });
    if (!member)
      return res.status(401).json({ success: false, message: "unauthorized" });

    if (member.$id != memberToDelete.$id && member.role != "ADMIN") {
      return res.status(401).json({ success: false, message: "unauthorized" });
    }
    const allMembersInWorkspace = await databases?.listDocuments(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_MEMBERS_ID,
      [Query.equal("workspaceId", memberToDelete.workspaceId)]
    );
    if (allMembersInWorkspace?.total == 1)
      return res.status(400).json({
        success: false,
        message: "All members can't be deleted from workspace",
      });
    await databases?.deleteDocument(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_MEMBERS_ID,
      memberId
    );
    return res
      .status(200)
      .json({ success: true, data: { $id: memberToDelete.$id } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const updateMemberOfWorkspace = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const databases = req.databases;
    const user = req.user;
    const { memberId } = req.params;
    const { role } = req.body;
    const memberToUpdate = await databases?.getDocument(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_MEMBERS_ID,
      memberId
    );
    if (!memberToUpdate)
      return res
        .status(400)
        .json({ success: false, message: "No member to update" });
    const member = await getMember({
      databases,
      workspaceId: memberToUpdate.workspaceId,
      userId: user?.$id,
    });
    if (!member)
      return res.status(401).json({ success: false, message: "unauthorized" });

    if (member.$id != memberToUpdate.$id && member.role != "ADMIN") {
      return res.status(401).json({ success: false, message: "unauthorized" });
    }
    const allMembersInWorkspace = await databases?.listDocuments(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_MEMBERS_ID,
      [Query.equal("workspaceId", memberToUpdate.workspaceId)]
    );
    if (allMembersInWorkspace?.total == 1)
      return res.status(400).json({
        success: false,
        message: "Cannot downgrade the only member",
      });
    await databases?.updateDocument(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_MEMBERS_ID,
      memberId,
      {
        role,
      }
    );
    return res
      .status(200)
      .json({ success: true, data: { $id: memberToUpdate.$id } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
