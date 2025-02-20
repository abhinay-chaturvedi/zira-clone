"use client"
import React from 'react'
import { useGetProjectAnalytics } from '../api/use-get-project-analytics'
import { useParams } from 'next/navigation'
import PageLoader from '@/components/page-loader'
import Analytics from '@/components/analytics'

const ProjectAnalytics = () => {
    const { projectId } = useParams<{ projectId: string }>()
    const {data, isLoading} = useGetProjectAnalytics({ projectId });
    

    if(isLoading) return <PageLoader/>

  return (
    <Analytics data={data}/>
  )
}

export default ProjectAnalytics