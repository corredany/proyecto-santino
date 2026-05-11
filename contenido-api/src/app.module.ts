import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { SeccionModule } from './presentation/modules/seccion.module';
import { ImagenModule } from './presentation/modules/imagen.module';
import { VideoModule } from './presentation/modules/video.module';
import { MaterialModule } from './presentation/modules/material.module';
import { PatrocinadorModule } from './presentation/modules/patrocinador.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 60,
      },
    ]),
    InfrastructureModule,
    SeccionModule,
    ImagenModule,
    VideoModule,
    MaterialModule,
    PatrocinadorModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
