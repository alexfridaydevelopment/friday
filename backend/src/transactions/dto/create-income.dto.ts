import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateIncomeDto {
  @IsNumber()
  amount: number;

  @IsString()
  source: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  date?: string;
}
