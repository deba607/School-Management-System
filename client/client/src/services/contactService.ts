import { IContact } from '@/types/contact';
import Contact from '@/models/Contact';
import { Logger } from '@/utils/logger';

export class ContactService {
  // Removed: private logger = new Logger('ContactService');

  async createContact(contactData: Omit<IContact, 'id'>): Promise<IContact> {
    try {
      const contact = new Contact(contactData);
      await contact.save();
      Logger.info('Contact created successfully', { contactId: contact.id });
      return contact;
    } catch (error) {
      Logger.error('Failed to create contact', error);
      throw new Error('Failed to create contact');
    }
  }

  async getContactById(id: string): Promise<IContact | null> {
    try {
      return await Contact.findById(id);
    } catch (error) {
      Logger.error('Failed to fetch contact', { id, error });
      throw new Error('Failed to fetch contact');
    }
  }

  async getAllContacts(): Promise<IContact[]> {
    try {
      return await Contact.find().sort({ createdAt: -1 });
    } catch (error) {
      Logger.error('Failed to fetch contacts', { error });
      throw new Error('Failed to fetch contacts');
    }
  }

  async updateContactStatus(id: string, status: IContact['status']): Promise<IContact | null> {
    try {
      return await Contact.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
    } catch (error) {
      Logger.error('Failed to update contact status', { id, status, error });
      throw new Error('Failed to update contact status');
    }
  }
}