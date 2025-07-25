import { Request, Response } from 'express';
import { ContactService } from '@/services/contactService';
import { ApiResponseUtil } from '@/utils/apiResponse';
import { IContact } from '@/types/contact';

export class ContactController {
  private contactService: ContactService;

  constructor() {
    this.contactService = new ContactService();
  }

  createContact = async (req: Request, res: Response) => {
    try {
      const contact = await this.contactService.createContact(req.body);
      return ApiResponseUtil.created<IContact>(contact, 'Contact created successfully');
    } catch (error) {
      return ApiResponseUtil.error(error instanceof Error ? error.message : String(error));
    }
  };

  getContact = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const contact = await this.contactService.getContactById(id);
      
      if (!contact) {
        return ApiResponseUtil.notFound('Contact not found');
      }

      return ApiResponseUtil.success<IContact>(contact);
    } catch (error) {
      return ApiResponseUtil.error(error instanceof Error ? error.message : String(error));
    }
  };

  getAllContacts = async (req: Request, res: Response) => {
    try {
      const contacts = await this.contactService.getAllContacts();
      return ApiResponseUtil.success<IContact[]>(contacts);
    } catch (error) {
      return ApiResponseUtil.error(error instanceof Error ? error.message : String(error));
    }
  };

  updateContactStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const contact = await this.contactService.updateContactStatus(id, status);
      
      if (!contact) {
        return ApiResponseUtil.notFound('Contact not found');
      }

      return ApiResponseUtil.success<IContact>(contact, 'Contact status updated');
    } catch (error) {
      return ApiResponseUtil.error(error instanceof Error ? error.message : String(error));
    }
  };
}