import { IsNumber, IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TransactionCategory } from '@prisma/client';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsEnum(TransactionCategory)
  category: TransactionCategory;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  date?: string;
}
