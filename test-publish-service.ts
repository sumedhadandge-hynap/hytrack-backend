import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { AppVersionsService } from './src/modules/app-versions/app-versions.service';

async function main() {
  console.log('Bootstrapping NestJS application context...');
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log('NestJS context loaded successfully!');

  const service = app.get(AppVersionsService);
  console.log('Got AppVersionsService instance.');

  try {
    // Let's try publishing version 40 (Vendor Registration draft)
    console.log('Publishing version 40...');
    const result = await service.publish(40);
    console.log('Publish result:', result);
  } catch (err) {
    console.error('Publish failed with error:', err);
  } finally {
    await app.close();
    console.log('NestJS context closed.');
  }
}

main().catch(console.error);
