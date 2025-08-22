import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// GET - Buscar sinopse específica
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

    const { data: synopsis, error } = await supabaseAdmin
      .from('synopses')
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
      console.error('Error fetching synopsis:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!synopsis) {
      return NextResponse.json({ error: 'Synopsis not found' }, { status: 404 })
    }

    return NextResponse.json({ synopsis })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Atualizar sinopse
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, content, userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Verificar se o usuário tem acesso à sinopse
    const { data: existingSynopsis } = await supabaseAdmin
      .from('synopses')
      .select(`
        id,
        projects!inner(
          user_id
        )
      `)
      .eq('id', id)
      .eq('projects.user_id', userId)
      .single()

    if (!existingSynopsis) {
      return NextResponse.json({ error: 'Synopsis not found or access denied' }, { status: 404 })
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content

    const { data: synopsis, error } = await supabaseAdmin
      .from('synopses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating synopsis:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ synopsis })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Deletar sinopse
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

    // Verificar se o usuário tem acesso à sinopse
    const { data: existingSynopsis } = await supabaseAdmin
      .from('synopses')
      .select(`
        id,
        projects!inner(
          user_id
        )
      `)
      .eq('id', id)
      .eq('projects.user_id', userId)
      .single()

    if (!existingSynopsis) {
      return NextResponse.json({ error: 'Synopsis not found or access denied' }, { status: 404 })
    }

    const { error } = await supabaseAdmin
      .from('synopses')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting synopsis:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Synopsis deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}