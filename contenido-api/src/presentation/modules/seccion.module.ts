import { Module } from '@nestjs/common';
import { SeccionController } from '../controllers/seccion.controller';
import { SeccionService } from '../../application/services/seccion.service';
import { SeccionRepository } from '../../infrastructure/repositories/seccion.repository';
import { SECCION_REPOSITORY } from '../../domain/tokens';

@Module({
  controllers: [SeccionController],
  providers: [
    { provide: SECCION_REPOSITORY, useClass: SeccionRepository },
    SeccionService,
  ],
})
export class SeccionModule {}
