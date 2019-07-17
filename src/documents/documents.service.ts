import { getRepository } from 'typeorm';
import { CreateDocumentDTO } from './dto/create-document.dto';
import { Document } from './document.entity';
import { User } from '../auth/user.entity';
import { DocumentNotFoundException } from '../exceptions/DocumentNotFoundException';

export class DocumentsService {
  private documentRepository = getRepository(Document);

  async getUserDocuments(user: User): Promise<Document[]> {
    const documents = await this.documentRepository
      .createQueryBuilder()
      .where('userid = :userid', { userid: user.id })
      .getMany();

    return documents;
  }

  async getDocumentById(id: number, user: User) {
    try {
      const found = await this.documentRepository.findOne({
        where: { id, userId: user.id }
      });
      if (found) return found;
    } catch (err) {
      throw new DocumentNotFoundException(id);
    }
  }

  async createDocument(
    createDocumentDTO: CreateDocumentDTO,
    user: User
  ): Promise<Document> {
    const newDocument = this.documentRepository.create({
      ...createDocumentDTO,
      user,
      userid: user.id
    });

    await this.documentRepository.save(newDocument);
    delete newDocument.user;
    return newDocument;
  }

  async updateDocument(id: number, text: string, user: User) {
    try {
      const document = await this.getDocumentById(id, user);
      if (document) {
        document.text = text;
        const updatedDocument = await this.documentRepository.save(document);
        return updatedDocument;
      }
    } catch (err) {
      throw new DocumentNotFoundException(id);
    }
  }

  async deleteDocument(id: number, user: User): Promise<void> {
    const result = await this.documentRepository.delete({
      id,
      userid: user.id
    });
    if (result.affected === 0) throw new DocumentNotFoundException(id);
  }
}
