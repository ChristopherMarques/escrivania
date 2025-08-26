import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// GET - Listar cenas de um capítulo
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chapterId = searchParams.get('chapterId')
    const userId = searchParams.get('userId')

    if (!chapterId || !userId) {
      return NextResponse.json({ error: 'Chapter ID and User ID are required' }, { status: 400 })
    }

    // Verificar se o usuário tem acesso ao capítulo
    const { data: chapter } = await supabaseAdmin
      .from('chapters')
      .select(`
        id,
        projects!inner(
          user_id
        )
      `)
      .eq('id', chapterId)
      .eq('projects.user_id', userId)
      .single()

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found or access denied' }, { status: 404 })
    }

    const { data: scenes, error } = await supabaseAdmin
      .from('scenes')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching scenes:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ scenes })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Criar nova cena
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, chapterId, orderIndex, userId } = body

    if (!title || !chapterId || !userId) {
      return NextResponse.json({ error: 'Title, Chapter ID and User ID are required' }, { status: 400 })
    }

    // Verificar se o usuário tem acesso ao capítulo
    const { data: chapter } = await supabaseAdmin
      .from('chapters')
      .select(`
        id,
        projects!inner(
          user_id
        )
      `)
      .eq('id', chapterId)
      .eq('projects.user_id', userId)
      .single()

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found or access denied' }, { status: 404 })
    }

    // Se orderIndex não foi fornecido, buscar o próximo índice
    let finalOrderIndex = orderIndex
    if (finalOrderIndex === undefined) {
      const { data: lastScene } = await supabaseAdmin
        .from('scenes')
        .select('order_index')
        .eq('chapter_id', chapterId)
        .order('order_index', { ascending: false })
        .limit(1)
        .single()

      finalOrderIndex = lastScene ? lastScene.order_index + 1 : 0
    }

    const { data: scene, error } = await supabaseAdmin
      .from('scenes')
      .insert({
        title,
        content: content || null,
        chapter_id: chapterId,
        order_index: finalOrderIndex
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating scene:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ scene }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}