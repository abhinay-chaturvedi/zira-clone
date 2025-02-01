import { getCurrent } from '@/lib/actions'
import { SignInCard } from '@/features/auth/components/sign-in-card'
import { redirect } from 'next/navigation';

const Page = async () => {
  const user = await getCurrent();
  console.log(user)
  if(user)  redirect("/")
  return (
      <SignInCard/>
  )
}

export default Page