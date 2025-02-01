import { Query, type Databases } from "node-appwrite";
import { config } from "../config";

export function generateInviteCode(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZaesrdtfkijhgewwedfsqwerrttyuyuolhkmjnbvcx12345678";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters[Math.floor(Math.random() * characters.length)];
  }
  return result;
}
interface GetMemberProps {
  databases?: Databases;
  workspaceId: string;
  userId?: string;
}
export const getMember = async ({
  databases,
  workspaceId,
  userId,
}: GetMemberProps) => {
  if (!databases || !userId) return null;
  const members = await databases.listDocuments(
    config.APPWRITE_DATABASE_ID,
    config.APPWRITE_MEMBERS_ID,
    [Query.equal("workspaceId", workspaceId), Query.equal("userId", userId)]
  );
  return members.documents[0];
};
