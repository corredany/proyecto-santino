import { Module } from '@nestjs/common';
import { PatrocinadorController } from '../controllers/patrocinador.controller';
import { PatrocinadorService } from '../../application/services/patrocinador.service';
import { PatrocinadorRepository } from '../../infrastructure/repositories/patrocinador.repository';
import { PATROCINADOR_REPOSITORY } from '../../domain/tokens';

@Module({
  controllers: [PatrocinadorController],
  providers: [
    { provide: PATROCINADOR_REPOSITORY, useClass: PatrocinadorRepository },
    PatrocinadorService,
  ],
})
export class PatrocinadorModule {}
