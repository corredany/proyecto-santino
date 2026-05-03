import { IsString, IsInt, IsOptional, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearPatrocinadorDto {
  @IsString()
  nombre!: string;

  @IsUrl()
  url!: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  orden?: number;
}

export class ActualizarPatrocinadorDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  orden?: number;
}
