import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// GET - Listar capítulos de um projeto
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

    const { data: chapters, error } = await supabaseAdmin
      .from('chapters')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching chapters:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ chapters })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Criar novo capítulo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, projectId, orderIndex, userId } = body

    if (!title || !projectId || !userId) {
      return NextResponse.json({ error: 'Title, Project ID and User ID are required' }, { status: 400 })
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

    // Se orderIndex não foi fornecido, buscar o próximo índice
    let finalOrderIndex = orderIndex
    if (finalOrderIndex === undefined) {
      const { data: lastChapter } = await supabaseAdmin
        .from('chapters')
        .select('order_index')
        .eq('project_id', projectId)
        .order('order_index', { ascending: false })
        .limit(1)
        .single()

      finalOrderIndex = lastChapter ? lastChapter.order_index + 1 : 0
    }

    const { data: chapter, error } = await supabaseAdmin
      .from('chapters')
      .insert({
        title,
        description: description || null,
        project_id: projectId,
        order_index: finalOrderIndex
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating chapter:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ chapter }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}