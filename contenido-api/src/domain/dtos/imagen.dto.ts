import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SubirImagenDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  seccionId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  orden?: number;
}

export class ActualizarImagenDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  seccionId?: number | null;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  orden?: number;
}
