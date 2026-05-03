import { Module } from '@nestjs/common';
import { VideoController } from '../controllers/video.controller';
import { VideoService } from '../../application/services/video.service';
import { VideoRepository } from '../../infrastructure/repositories/video.repository';
import { VIDEO_REPOSITORY } from '../../domain/tokens';

@Module({
  controllers: [VideoController],
  providers: [
    { provide: VIDEO_REPOSITORY, useClass: VideoRepository },
    VideoService,
  ],
})
export class VideoModule {}
