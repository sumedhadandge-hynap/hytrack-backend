const { Client } = require('pg');

async function main() {
    const client = new Client({
        connectionString: 'postgresql://postgres:mfa@123@localhost:5433/hytrack_clean_db'
    });
    await client.connect();

    // Query constraints on project_apps
    const res = await client.query(`
        SELECT conname, pg_get_constraintdef(oid) as def
        FROM pg_constraint 
        WHERE conrelid = 'project_apps'::regclass;
    `);
    console.log("Constraints on project_apps:");
    console.log(res.rows);

    await client.end();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
