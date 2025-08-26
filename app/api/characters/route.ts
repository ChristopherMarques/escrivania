import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

// GET - Listar personagens de um projeto
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const userId = searchParams.get("userId");

    if (!projectId || !userId) {
      return NextResponse.json(
        { error: "Project ID and User ID are required" },
        { status: 400 }
      );
    }

    // Verificar se o usuário tem acesso ao projeto
    const { data: project } = await supabaseAdmin
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", userId)
      .single();

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    const { data: characters, error } = await supabaseAdmin
      .from("characters")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching characters:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ characters });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Criar novo personagem
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, projectId, userId } = body;

    if (!name || !projectId || !userId) {
      return NextResponse.json(
        { error: "Name, Project ID and User ID are required" },
        { status: 400 }
      );
    }

    // Verificar se o usuário tem acesso ao projeto
    const { data: project } = await supabaseAdmin
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", userId)
      .single();

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    const { data: character, error } = await supabaseAdmin
      .from("characters")
      .insert({
        name,
        description: description || null,
        project_id: projectId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating character:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ character }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
