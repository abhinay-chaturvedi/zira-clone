import { getCurrent, getWorkspaces } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");
  const workspaces = await getWorkspaces();
  // console.info(workspaces, "workspaces");
  if(workspaces.total == 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`workspaces/${workspaces.documents[0].$id}`)
  }
  return <div className="bg-neutral-500">Home page</div>;
  // return <CreateWorkspaceForm/>
}
