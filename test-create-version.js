const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/src/app.module');
const { AppVersionsService } = require('./dist/src/modules/app-versions/app-versions.service');
const { Client } = require('pg');

async function main() {
  console.log('Bootstrapping NestJS application context...');
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log('NestJS context loaded successfully!');

  const service = app.get(AppVersionsService);
  console.log('Got AppVersionsService instance.');

  // Let's get the DB provider from NestJS and query apps
  const db = app.get('DB');
  const allApps = await db.query.apps.findMany();
  console.log('--- Apps seen by NestJS Drizzle ---', allApps);

  try {
    // Create Version 2 of Demo app (app_id: 26)
    console.log('Creating version 2 draft for app 26...');
    const result = await service.create({
      app_id: 26,
      version_number: 2,
      version_name: 'Version 2',
      notes: 'Test clone draft for version 2'
    }, 1);
    console.log('Create result:', result);

    // Query database to verify cloned items
    const client = new Client({
      connectionString: 'postgresql://postgres:mfa@123@localhost:5433/hytrack_clean_db',
    });
    await client.connect();
    console.log('Connected to database to check cloned items...');

    const stepsRes = await client.query('SELECT id, name, step_type, version_id FROM app_steps WHERE version_id = $1', [result.id]);
    console.log('--- Steps in New Version ---');
    console.log(stepsRes.rows);

    for (const step of stepsRes.rows) {
      if (step.step_type === 'form') {
        const fieldsRes = await client.query('SELECT id, step_id, label, field_key FROM app_fields WHERE step_id = $1', [step.id]);
        console.log(`--- Fields in Form Step (${step.id}) ---`);
        console.log(fieldsRes.rows);
      } else if (step.step_type === 'approval') {
        const approversRes = await client.query('SELECT id, step_id, role_id, user_id FROM step_approvers WHERE step_id = $1', [step.id]);
        console.log(`--- Approvers in Approval Step (${step.id}) ---`);
        console.log(approversRes.rows);
      }
    }

    await client.end();
  } catch (err) {
    console.error('Test failed with error:', err);
  } finally {
    await app.close();
    console.log('NestJS context closed.');
  }
}

main().catch(console.error);
