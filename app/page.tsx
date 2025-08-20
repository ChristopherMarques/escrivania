'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { ProjectProvider } from '@/contexts/ProjectContext'
import { AuthProvider } from '@/contexts/AuthContext'

export default function Home() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <MainLayout />
      </ProjectProvider>
    </AuthProvider>
  )
}
