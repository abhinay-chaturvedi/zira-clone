import { getCurrent } from '@/lib/actions'
import { SignUpCard } from '@/features/auth/components/sign-up-card'
import { redirect } from 'next/navigation';
import React from 'react'

const Page = async () => {
  const user = await getCurrent();
  if(user)  redirect("/")
  return (
      <SignUpCard/>
  )
}

export default Page