"use server";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "../features/auth/constants";
import { Account, Client, Databases, Query } from "node-appwrite";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, WORKSPACES_ID } from "@/config";
import { getAppWriteSessionClient } from "./utils";

export const getCurrent = async () => {
  try {
    const session = await cookies().get(AUTH_COOKIE);
    // console.info(session, "session");
    if (!session) return null;

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
      .setSession(session.value);
    const account = new Account(client);
    return await account.get();
  } catch {
    return null;
  }
};
export const getWorkspaces = async () => {
  const session = await cookies().get(AUTH_COOKIE);
  // console.info(session, "session");
  if (!session) return { documents: [], total: 0 };

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setSession(session.value);

  const databases = new Databases(client);
  const account = new Account(client);
  const user = await account.get();
  const members = await databases?.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal("userId", user?.$id),
  ]);
  if (members?.total === 0) {
    return { documents: [], total: 0 };
  }
  const workspaceIds = members?.documents.map(
    (member): string => member.workspaceId
  );
  const workspaces = await databases?.listDocuments(
    DATABASE_ID,
    WORKSPACES_ID,
    [Query.contains("$id", workspaceIds!), Query.orderDesc("$createdAt")]
  );
  return workspaces;
};
export const getWorkspace = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const session = await cookies().get(AUTH_COOKIE);
  // console.info(session, "session");
  if (!session) return null;

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setSession(session.value);

  const databases = new Databases(client);
  // const account = new Account(client);
  // const user = await account.get()
  const workspace = await databases?.getDocument(
    DATABASE_ID,
    WORKSPACES_ID,
    workspaceId
  );
  return workspace;
};
interface GetProjectProps {
  projectId: string
}
export const getProject = async ({projectId}: GetProjectProps) => {
  const session = await cookies().get(AUTH_COOKIE);
  if(!session) return null;
  const client = await getAppWriteSessionClient();
  client.setSession(session.value)
  const databases = new Databases(client);
  const account = new Account(client);
  const user = await account.get();
  const project = await databases.getDocument(DATABASE_ID, PROJECTS_ID, projectId);
  const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal("workspaceId", project.workspaceId), Query.equal("userId", user.$id)
  ])
  const member = members.documents[0];
  if(!member) return null;
  return project
  

}
