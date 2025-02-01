import { getCurrent } from '@/lib/actions';
import { redirect } from 'next/navigation';
import React from 'react'

const Page = async ({params}: { params: {workspaceId: string}}) => {
    const user = await getCurrent();
    
      if (!user) redirect("/sign-in");
  return (
    <div>{JSON.stringify(params.workspaceId)}</div>
  )
}

export default Page