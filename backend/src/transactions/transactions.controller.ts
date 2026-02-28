import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateIncomeDto } from './dto/create-income.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  // ========== EXPENSES ==========
  @Post('expense')
  createExpense(@Request() req: any, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.createExpense(req.user.sub, dto);
  }

  @Get('expenses')
  getExpenses(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.transactionsService.getExpenses(req.user.sub, startDate, endDate);
  }

  @Get('expense/:id')
  getExpenseById(@Param('id') id: string, @Request() req: any) {
    return this.transactionsService.getExpenseById(id, req.user.sub);
  }

  @Put('expense/:id')
  updateExpense(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionsService.updateExpense(id, req.user.sub, dto);
  }

  @Delete('expense/:id')
  deleteExpense(@Param('id') id: string, @Request() req: any) {
    return this.transactionsService.deleteExpense(id, req.user.sub);
  }

  // ========== INCOMES ==========
  @Post('income')
  createIncome(@Request() req: any, @Body() dto: CreateIncomeDto) {
    return this.transactionsService.createIncome(req.user.sub, dto);
  }

  @Get('incomes')
  getIncomes(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.transactionsService.getIncomes(req.user.sub, startDate, endDate);
  }

  @Get('income/:id')
  getIncomeById(@Param('id') id: string, @Request() req: any) {
    return this.transactionsService.getIncomeById(id, req.user.sub);
  }

  @Put('income/:id')
  updateIncome(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: CreateIncomeDto,
  ) {
    return this.transactionsService.updateIncome(id, req.user.sub, dto);
  }

  @Delete('income/:id')
  deleteIncome(@Param('id') id: string, @Request() req: any) {
    return this.transactionsService.deleteIncome(id, req.user.sub);
  }

  // ========== SUMMARY ==========
  @Get('summary')
  getSummary(@Request() req: any, @Query('month') month?: string) {
    return this.transactionsService.getSummary(req.user.sub, month);
  }

  @Get('categories')
  getExpensesByCategory(@Request() req: any, @Query('month') month?: string) {
    return this.transactionsService.getExpensesByCategory(req.user.sub, month);
  }
}
