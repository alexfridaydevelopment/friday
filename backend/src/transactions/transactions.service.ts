import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateIncomeDto } from './dto/create-income.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  // ========== EXPENSES ==========
  async createExpense(userId: string, dto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        userId,
        amount: dto.amount,
        type: 'EXPENSE',
        category: dto.category,
        description: dto.description,
        date: dto.date ? new Date(dto.date) : new Date(),
      },
    });
  }

  async getExpenses(userId: string, startDate?: string, endDate?: string) {
    const where: any = { userId, type: 'EXPENSE' };
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    return this.prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async getExpenseById(id: string, userId: string) {
    return this.prisma.transaction.findFirst({
      where: { id, userId, type: 'EXPENSE' },
    });
  }

  async updateExpense(id: string, userId: string, dto: CreateTransactionDto) {
    return this.prisma.transaction.updateMany({
      where: { id, userId },
      data: {
        amount: dto.amount,
        category: dto.category,
        description: dto.description,
        date: dto.date ? new Date(dto.date) : new Date(),
      },
    });
  }

  async deleteExpense(id: string, userId: string) {
    return this.prisma.transaction.deleteMany({
      where: { id, userId },
    });
  }

  // ========== INCOMES ==========
  async createIncome(userId: string, dto: CreateIncomeDto) {
    return this.prisma.income.create({
      data: {
        userId,
        amount: dto.amount,
        source: dto.source,
        description: dto.description,
        date: dto.date ? new Date(dto.date) : new Date(),
      },
    });
  }

  async getIncomes(userId: string, startDate?: string, endDate?: string) {
    const where: any = { userId };
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    return this.prisma.income.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async getIncomeById(id: string, userId: string) {
    return this.prisma.income.findFirst({
      where: { id, userId },
    });
  }

  async updateIncome(id: string, userId: string, dto: CreateIncomeDto) {
    return this.prisma.income.updateMany({
      where: { id, userId },
      data: {
        amount: dto.amount,
        source: dto.source,
        description: dto.description,
        date: dto.date ? new Date(dto.date) : new Date(),
      },
    });
  }

  async deleteIncome(id: string, userId: string) {
    return this.prisma.income.deleteMany({
      where: { id, userId },
    });
  }

  // ========== SUMMARY ==========
  async getSummary(userId: string, month?: string) {
    const where: any = { userId };
    
    if (month) {
      const [year, m] = month.split('-');
      const startDate = new Date(parseInt(year), parseInt(m) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(m), 0, 23, 59, 59);
      where.date = { gte: startDate, lte: endDate };
    }

    const [expenses, incomes] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { ...where, type: 'EXPENSE' },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.income.aggregate({
        where,
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    return {
      totalExpenses: expenses._sum.amount || 0,
      expenseCount: expenses._count,
      totalIncome: incomes._sum.amount || 0,
      incomeCount: incomes._count,
      balance: (incomes._sum.amount || 0) - (expenses._sum.amount || 0),
    };
  }

  // ========== CATEGORIES ==========
  async getExpensesByCategory(userId: string, month?: string) {
    const where: any = { userId, type: 'EXPENSE' };
    
    if (month) {
      const [year, m] = month.split('-');
      const startDate = new Date(parseInt(year), parseInt(m) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(m), 0, 23, 59, 59);
      where.date = { gte: startDate, lte: endDate };
    }

    const result = await this.prisma.transaction.groupBy({
      by: ['category'],
      where,
      _sum: { amount: true },
      _count: true,
    });

    return result.map(r => ({
      category: r.category,
      total: r._sum.amount || 0,
      count: r._count,
    }));
  }
}
