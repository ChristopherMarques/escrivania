const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// Ler variáveis de ambiente do arquivo .env.local
const envPath = path.join(__dirname, ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");
const envLines = envContent.split("\n");
for (const line of envLines) {
  if (line.includes("=") && !line.startsWith("#")) {
    const [key, ...valueParts] = line.split("=");
    const value = valueParts.join("=").trim();
    process.env[key.trim()] = value;
  }
}

async function setupSupabaseSchema() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("Conectando ao banco de dados...");

    // Primeiro, vamos remover as políticas existentes e recriar as tabelas
    console.log("Removendo políticas e recriando tabelas...");

    try {
      // Remover políticas existentes
      await pool.query(`
        DROP POLICY IF EXISTS "Users can view own profile" ON users;
        DROP POLICY IF EXISTS "Users can update own profile" ON users;
        DROP POLICY IF EXISTS "Users can view own projects" ON projects;
        DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
        DROP POLICY IF EXISTS "Users can update own projects" ON projects;
        DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
      `);

      // Remover e recriar tabelas com os tipos corretos
      await pool.query(`
        DROP TABLE IF EXISTS synopses CASCADE;
        DROP TABLE IF EXISTS characters CASCADE;
        DROP TABLE IF EXISTS scenes CASCADE;
        DROP TABLE IF EXISTS chapters CASCADE;
        DROP TABLE IF EXISTS projects CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
      `);

      console.log("Tabelas removidas com sucesso");
    } catch (dropError) {
      console.log("Aviso ao remover tabelas:", dropError.message);
    }

    // Ler e executar o arquivo SQL atualizado
    const sqlPath = path.join(__dirname, "supabase", "schema.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("Executando schema atualizado do Supabase...");
    await pool.query(sql);

    console.log("✅ Schema do Supabase atualizado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao atualizar schema:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupSupabaseSchema();
