import { Module } from '@nestjs/common';
import { MaterialController } from '../controllers/material.controller';
import { MaterialService } from '../../application/services/material.service';
import { MaterialRepository } from '../../infrastructure/repositories/material.repository';
import { MATERIAL_REPOSITORY } from '../../domain/tokens';

@Module({
  controllers: [MaterialController],
  providers: [
    { provide: MATERIAL_REPOSITORY, useClass: MaterialRepository },
    MaterialService,
  ],
})
export class MaterialModule {}
