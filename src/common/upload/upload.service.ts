import {
  Injectable,
} from '@nestjs/common';

import type { Express }
from 'express';

import {
  mkdir,
  writeFile,
} from 'fs/promises';

import * as path from 'path';

import * as crypto from 'crypto';

@Injectable()
export class UploadService {

  private uploadDir =
    process.env.UPLOAD_DIR ||
    './public/uploads';

  async saveFile(
    file: Express.Multer.File,
    folder = 'general',
  ) {

    const ext =
      path.extname(
        file.originalname,
      );

    const fileName =
      `${crypto.randomUUID()}${ext}`;

    const dir =
      path.join(
        this.uploadDir,
        folder,
      );

    await mkdir(dir, {
      recursive: true,
    });

    const filePath =
      path.join(
        dir,
        fileName,
      );

    await writeFile(
      filePath,
      file.buffer,
    );

    return {
      file_name: fileName,

      url:
        `${process.env.APP_URL}/uploads/${folder}/${fileName}`,
    };
  }

  async saveAvatar(
    file: Express.Multer.File,
  ) {

    return this.saveFile(
      file,
      'avatars',
    );
  }

  async saveAppLogo(
    file: Express.Multer.File,
  ) {

    return this.saveFile(
      file,
      'logos',
    );
  }
}