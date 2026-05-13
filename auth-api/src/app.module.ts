import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth.module';
import { UsuariosModule } from './usuarios.module';
import { LimpiezaService } from './application/services/limpieza.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    UsuariosModule,
  ],
  controllers: [],
  providers: [
    LimpiezaService,
  ],
})
export class AppModule {}