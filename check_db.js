const { Client } = require('pg');

async function main() {
    const client = new Client({
        connectionString: 'postgresql://postgres:mfa@123@localhost:5433/hytrack_clean_db'
    });
    await client.connect();

    // Query tables in public schema
    const res = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
    `);
    console.log("Tables in public schema:");
    console.log(res.rows.map(r => r.table_name));

    await client.end();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
