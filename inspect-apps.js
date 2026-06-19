const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres:mfa@123@localhost:5433/hytrack_clean_db',
  });
  await client.connect();
  console.log('Connected to database!');

  try {
    const res = await client.query('SELECT id, name, is_published FROM apps');
    console.log('--- Apps Status ---');
    console.log(res.rows);

    const versionsRes = await client.query('SELECT id, app_id, version_number, is_published FROM app_versions');
    console.log('--- App Versions ---');
    console.log(versionsRes.rows);

  } catch (err) {
    console.log('Query failed:', err.message);
  }

  await client.end();
}

main().catch(console.error);
