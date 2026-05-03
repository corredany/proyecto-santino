import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SubirVideoDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  seccionId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  orden?: number;
}

export class ActualizarVideoDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  seccionId?: number | null;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  orden?: number;
}
