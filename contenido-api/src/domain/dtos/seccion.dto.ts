import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearSeccionDto {
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  descripcionPrincipal?: string;

  @IsOptional()
  @IsString()
  descripcionSeccion?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  orden?: number;
}

export class ActualizarSeccionDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcionPrincipal?: string;

  @IsOptional()
  @IsString()
  descripcionSeccion?: string;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  orden?: number;
}

export class ActualizarOrdenDto {
  @IsInt()
  id!: number;

  @IsInt()
  orden!: number;
}
