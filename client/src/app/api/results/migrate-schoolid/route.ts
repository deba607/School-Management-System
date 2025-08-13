import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/withAuth';
import { connectDB } from '@/lib/mongoose';
import { ApiResponse } from '@/lib/apiResponse';
import { Result } from '@/models/Result';
import { Student } from '@/models/Student';

async function handlePOST(req: NextRequest) {
  try {
    await connectDB();

    const schoolId = req.user?.schoolId;
    if (!schoolId) {
      return ApiResponse.error({ error: 'School ID not found on user', status: 400 });
    }

    // Find candidate results missing schoolId
    const candidates = await Result.find({
      $or: [
        { schoolId: { $exists: false } },
        { schoolId: '' },
        { schoolId: null },
      ],
    }).lean();

    if (!candidates.length) {
      return ApiResponse.success({ data: { matched: 0, updated: 0 }, message: 'No results to backfill' });
    }

    // Collect all student ids referenced by these results
    const studentIds: string[] = [];
    for (const r of candidates) {
      if (Array.isArray(r.students)) {
        for (const s of r.students) {
          if (s && s.id) studentIds.push(String(s.id));
        }
      }
    }

    const uniqueStudentIds = Array.from(new Set(studentIds));
    const students = await Student.find({ _id: { $in: uniqueStudentIds } }, 'schoolId').lean();
    const studentIdToSchool: Record<string, string> = {};
    for (const s of students) {
      studentIdToSchool[String((s as any)._id)] = String((s as any).schoolId);
    }

    // Determine which results belong to the current school (all students must match)
    const updates: { updateOne: { filter: any; update: any } }[] = [];
    let matched = 0;
    for (const r of candidates) {
      const stuIds = (Array.isArray(r.students) ? r.students : []).map((s: any) => String(s.id)).filter(Boolean);
      if (!stuIds.length) continue;

      const allMatch = stuIds.every((sid: string) => studentIdToSchool[sid] === schoolId);
      if (allMatch) {
        matched += 1;
        updates.push({ updateOne: { filter: { _id: r._id }, update: { $set: { schoolId } } } });
      }
    }

    let updated = 0;
    if (updates.length) {
      const res = await Result.bulkWrite(updates);
      updated = res.modifiedCount || 0;
    }

    return ApiResponse.success({ data: { matched, updated }, message: 'Backfill complete' });
  } catch (error) {
    return ApiResponse.serverError(error);
  }
}

export const POST = (req: NextRequest) => withAuth(req, handlePOST, ['admin', 'school']);


