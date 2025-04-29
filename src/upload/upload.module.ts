import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';

@Module({
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {
  constructor() {
    console.log('🧩 UploadModule loaded');
  }
}
