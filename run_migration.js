const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
    const client = new Client({
        connectionString: 'postgresql://postgres:mfa@123@localhost:5433/hytrack_clean_db'
    });
    await client.connect();

    const migrationPath = path.join(__dirname, 'src/database/migrations/0008_stiff_tyrannus.sql');
    const content = fs.readFileSync(migrationPath, 'utf8');

    // Split by statement-breakpoint
    const statements = content.split('--> statement-breakpoint');

    console.log(`Found ${statements.length} SQL statements to execute.`);

    for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i].trim();
        if (!stmt) continue;

        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        try {
            await client.query(stmt);
            console.log(`Statement ${i + 1} succeeded.`);
        } catch (err) {
            console.error(`Statement ${i + 1} failed:`);
            console.error(stmt);
            console.error(err.message);
            throw err;
        }
    }

    // Since we successfully ran the SQL manually, let's register the migration in drizzle's metadata table so drizzle doesn't try to run it again
    // First, let's see if __drizzle_migrations table exists
    try {
        const checkMeta = await client.query("SELECT * FROM information_schema.tables WHERE table_name = '__drizzle_migrations';");
        if (checkMeta.rows.length > 0) {
            // Insert migration metadata
            const query = `
                INSERT INTO "__drizzle_migrations" (hash, created_at)
                VALUES ($1, $2)
                ON CONFLICT DO NOTHING;
            `;
            // Drizzle migrations table columns might be id, hash, created_at
            // Let's check columns of __drizzle_migrations
            const cols = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = '__drizzle_migrations';");
            console.log("Columns in __drizzle_migrations:", cols.rows.map(c => c.column_name));
            
            // We can just query or insert
            // To be safe, let's check what rows are in there
            const rows = await client.query("SELECT * FROM __drizzle_migrations;");
            console.log("Existing migrations in DB:", rows.rows);
        }
    } catch (e) {
        console.log("Failed to insert into __drizzle_migrations:", e.message);
    }

    await client.end();
}

main().catch(err => {
    console.error("Migration failed");
    process.exit(1);
});
