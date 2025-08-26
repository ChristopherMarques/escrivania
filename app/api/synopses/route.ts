import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// GET - Listar sinopses de um projeto
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const userId = searchParams.get('userId')

    if (!projectId || !userId) {
      return NextResponse.json({ error: 'Project ID and User ID are required' }, { status: 400 })
    }

    // Verificar se o usuário tem acesso ao projeto
    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single()

    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 })
    }

    const { data: synopses, error } = await supabaseAdmin
      .from('synopses')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching synopses:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ synopses })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Criar nova sinopse
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, projectId, userId } = body

    if (!title || !content || !projectId || !userId) {
      return NextResponse.json({ error: 'Title, Content, Project ID and User ID are required' }, { status: 400 })
    }

    // Verificar se o usuário tem acesso ao projeto
    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single()

    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 })
    }

    const { data: synopsis, error } = await supabaseAdmin
      .from('synopses')
      .insert({
        title,
        content,
        project_id: projectId
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating synopsis:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ synopsis }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}