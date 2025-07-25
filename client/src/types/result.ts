export interface IResultStudent {
  id: string;
  name: string;
  marks: string;
  grade: string;
}

export interface IResult {
  _id?: string;
  className: string;
  section: string;
  subject: string;
  teacher: string;
  date: Date | string;
  students: IResultStudent[];
  createdAt: Date | string;
  updatedAt: Date | string;
} 