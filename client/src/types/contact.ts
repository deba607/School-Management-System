export interface IContact {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status?: 'new' | 'in-progress' | 'resolved';
  createdAt?: Date;
  updatedAt?: Date;
}