import { Module } from '@nestjs/common';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { SeccionModule } from './presentation/modules/seccion.module';
import { ImagenModule } from './presentation/modules/imagen.module';
import { VideoModule } from './presentation/modules/video.module';
import { MaterialModule } from './presentation/modules/material.module';
import { PatrocinadorModule } from './presentation/modules/patrocinador.module';

@Module({
  imports: [
    InfrastructureModule,
    SeccionModule,
    ImagenModule,
    VideoModule,
    MaterialModule,
    PatrocinadorModule,
  ],
})
export class AppModule {}
