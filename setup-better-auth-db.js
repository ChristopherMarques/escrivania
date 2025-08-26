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

async function setupDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("Conectando ao banco de dados...");

    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, "better-auth-schema.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("Executando schema do Better Auth...");
    await pool.query(sql);

    console.log("✅ Schema do Better Auth criado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao criar schema:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
