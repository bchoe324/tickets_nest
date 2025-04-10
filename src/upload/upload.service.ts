import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { v4 } from 'uuid';
import { Express } from 'express';

@Injectable()
export class UploadService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async uploadImageFile(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    console.log('uploadImageFile function');
    const supabase = this.supabaseService.getClient();
    if (!file) {
      console.log('파일 없음');
      throw new UnauthorizedException('파일이 없습니다.');
    }
    const { originalname, buffer, mimetype } = file;
    const fileExt = originalname.split('.').pop();
    const filePath = `${userId}/${v4()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('tickets-images')
      .upload(filePath, buffer, {
        contentType: mimetype,
        upsert: false,
      });
    if (error) {
      throw new Error(`파일 업로드 실패: ${error.message}`);
    }
    return data.fullPath;
  }
}
