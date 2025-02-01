"use client"
import ResponsiveModal from '@/components/responsive-modal'
import React from 'react'
import CreateWorkspaceForm from './create-workspace-form'
import useCreateWorkspaceModal from '@/features/hooks/use-create-workspace-modal'

const CreateWorkspaceModal = () => {
    const { isOpen, setIsOpen, close } = useCreateWorkspaceModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
        <CreateWorkspaceForm onCancel={close}/>
        {/* <CreateWorkspaceForm/> */}
    </ResponsiveModal>
  )
}

export default CreateWorkspaceModal