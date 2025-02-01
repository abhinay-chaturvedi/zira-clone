import MembersList from "@/features/members/components/members-list";
import { getCurrent } from "@/lib/actions";
import { redirect } from "next/navigation";
import React from "react";

interface MembersPageProps {
    params: {
        workspaceId: string
    }
}

const Page = async ({params}: MembersPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return (
    <div className="w-full lg:max-w-xl">
      <MembersList workspaceId={params.workspaceId}/>
    </div>
  );
};

export default Page;
