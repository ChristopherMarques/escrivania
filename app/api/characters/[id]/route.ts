import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// GET - Buscar personagem específico
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

    const { data: character, error } = await supabaseAdmin
      .from('characters')
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
      console.error('Error fetching character:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    return NextResponse.json({ character })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Atualizar personagem
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Verificar se o usuário tem acesso ao personagem
    const { data: existingCharacter } = await supabaseAdmin
      .from('characters')
      .select(`
        id,
        projects!inner(
          user_id
        )
      `)
      .eq('id', id)
      .eq('projects.user_id', userId)
      .single()

    if (!existingCharacter) {
      return NextResponse.json({ error: 'Character not found or access denied' }, { status: 404 })
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description

    const { data: character, error } = await supabaseAdmin
      .from('characters')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating character:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ character })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Deletar personagem
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

    // Verificar se o usuário tem acesso ao personagem
    const { data: existingCharacter } = await supabaseAdmin
      .from('characters')
      .select(`
        id,
        projects!inner(
          user_id
        )
      `)
      .eq('id', id)
      .eq('projects.user_id', userId)
      .single()

    if (!existingCharacter) {
      return NextResponse.json({ error: 'Character not found or access denied' }, { status: 404 })
    }

    const { error } = await supabaseAdmin
      .from('characters')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting character:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Character deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}