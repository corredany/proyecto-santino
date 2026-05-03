import { Module } from '@nestjs/common';
import { ImagenController } from '../controllers/imagen.controller';
import { ImagenService } from '../../application/services/imagen.service';
import { ImagenRepository } from '../../infrastructure/repositories/imagen.repository';
import { IMAGEN_REPOSITORY } from '../../domain/tokens';

@Module({
  controllers: [ImagenController],
  providers: [
    { provide: IMAGEN_REPOSITORY, useClass: ImagenRepository },
    ImagenService,
  ],
})
export class ImagenModule {}
