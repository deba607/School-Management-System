import { Result, IResult } from '@/models/Result';
import { connectDB } from '@/lib/mongoose';

export class ResultService {
  async createResult(data: Omit<IResult, 'id' | 'createdAt' | 'updatedAt'>): Promise<IResult> {
    await connectDB();
    const result = new Result(data);
    return await result.save();
  }

  async getAllResults(): Promise<IResult[]> {
    await connectDB();
    return await Result.find({}).sort({ date: -1 });
  }
} 