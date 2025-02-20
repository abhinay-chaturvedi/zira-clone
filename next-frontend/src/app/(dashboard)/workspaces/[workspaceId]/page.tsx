import { getCurrent } from "@/lib/actions";
import { redirect } from "next/navigation";
import React from "react";
import WorkspaceIdClient from "./client";

const Page = async () => {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");
  return (
      <WorkspaceIdClient />
   
  );
};

export default Page;
