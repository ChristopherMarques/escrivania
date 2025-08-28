import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

// GET - Buscar local específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { data: location, error } = await supabaseAdmin
      .from("locations")
      .select(
        `
        *,
        projects!inner(
          id,
          user_id
        )
      `
      )
      .eq("id", id)
      .eq("projects.user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching location:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!location) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ location });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar local
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      locationType,
      atmosphere,
      importantDetails,
      userId,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verificar se o usuário tem acesso ao local
    const { data: existingLocation } = await supabaseAdmin
      .from("locations")
      .select(
        `
        id,
        projects!inner(
          user_id
        )
      `
      )
      .eq("id", id)
      .eq("projects.user_id", userId)
      .single();

    if (!existingLocation) {
      return NextResponse.json(
        { error: "Location not found or access denied" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (locationType !== undefined) updateData.location_type = locationType;
    if (atmosphere !== undefined) updateData.atmosphere = atmosphere;
    if (importantDetails !== undefined)
      updateData.important_details = importantDetails;

    const { data: location, error } = await supabaseAdmin
      .from("locations")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating location:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ location });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Deletar local
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verificar se o usuário tem acesso ao local
    const { data: existingLocation } = await supabaseAdmin
      .from("locations")
      .select(
        `
        id,
        projects!inner(
          user_id
        )
      `
      )
      .eq("id", id)
      .eq("projects.user_id", userId)
      .single();

    if (!existingLocation) {
      return NextResponse.json(
        { error: "Location not found or access denied" },
        { status: 404 }
      );
    }

    const { error } = await supabaseAdmin
      .from("locations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting location:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Location deleted successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
