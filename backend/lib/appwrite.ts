import { Account, Client, Users } from "node-appwrite";

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT!)
    .setKey(process.env.APPWRITE_KEY!);
  return {
    get account() {
      return new Account(client);
    },
    get users() {
      return new Users(client)
    }
  };
}
