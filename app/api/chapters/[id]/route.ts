import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// GET - Buscar capítulo específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const { data: chapter, error } = await supabaseAdmin
      .from('chapters')
      .select(`
        *,
        projects!inner(
          id,
          user_id
        )
      `)
      .eq('id', id)
      .eq('projects.user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching chapter:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    return NextResponse.json({ chapter })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Atualizar capítulo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, description, orderIndex, userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Verificar se o usuário tem acesso ao capítulo
    const { data: existingChapter } = await supabaseAdmin
      .from('chapters')
      .select(`
        id,
        projects!inner(
          user_id
        )
      `)
      .eq('id', id)
      .eq('projects.user_id', userId)
      .single()

    if (!existingChapter) {
      return NextResponse.json({ error: 'Chapter not found or access denied' }, { status: 404 })
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (orderIndex !== undefined) updateData.order_index = orderIndex

    const { data: chapter, error } = await supabaseAdmin
      .from('chapters')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating chapter:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ chapter })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Deletar capítulo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Verificar se o usuário tem acesso ao capítulo
    const { data: existingChapter } = await supabaseAdmin
      .from('chapters')
      .select(`
        id,
        projects!inner(
          user_id
        )
      `)
      .eq('id', id)
      .eq('projects.user_id', userId)
      .single()

    if (!existingChapter) {
      return NextResponse.json({ error: 'Chapter not found or access denied' }, { status: 404 })
    }

    const { error } = await supabaseAdmin
      .from('chapters')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting chapter:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Chapter deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}