import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// GET - Buscar cena específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const { data: scene, error } = await supabaseAdmin
      .from('scenes')
      .select(`
        *,
        chapters!inner(
          id,
          projects!inner(
            user_id
          )
        )
      `)
      .eq('id', id)
      .eq('chapters.projects.user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching scene:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!scene) {
      return NextResponse.json({ error: 'Scene not found' }, { status: 404 })
    }

    return NextResponse.json({ scene })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Atualizar cena
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, content, orderIndex, userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Verificar se o usuário tem acesso à cena
    const { data: existingScene } = await supabaseAdmin
      .from('scenes')
      .select(`
        id,
        chapters!inner(
          projects!inner(
            user_id
          )
        )
      `)
      .eq('id', id)
      .eq('chapters.projects.user_id', userId)
      .single()

    if (!existingScene) {
      return NextResponse.json({ error: 'Scene not found or access denied' }, { status: 404 })
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (orderIndex !== undefined) updateData.order_index = orderIndex

    const { data: scene, error } = await supabaseAdmin
      .from('scenes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating scene:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ scene })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Deletar cena
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Verificar se o usuário tem acesso à cena
    const { data: existingScene } = await supabaseAdmin
      .from('scenes')
      .select(`
        id,
        chapters!inner(
          projects!inner(
            user_id
          )
        )
      `)
      .eq('id', id)
      .eq('chapters.projects.user_id', userId)
      .single()

    if (!existingScene) {
      return NextResponse.json({ error: 'Scene not found or access denied' }, { status: 404 })
    }

    const { error } = await supabaseAdmin
      .from('scenes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting scene:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Scene deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}