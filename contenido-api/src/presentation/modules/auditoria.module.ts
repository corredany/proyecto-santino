import { Module } from '@nestjs/common';
import { AuditoriaService } from '../../application/services/auditoria.service';

@Module({
  providers: [AuditoriaService],
})
export class AuditoriaModule {}
