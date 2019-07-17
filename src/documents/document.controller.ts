import express, { Request, Response, NextFunction } from 'express';
import { Controller } from '../interfaces/controller.interface';
import { DocumentsService } from './documents.service';
import { CreateDocumentDTO } from './dto/create-document.dto';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { User } from '../auth/user.entity';
import { authMiddleware } from '../middlewares/authMiddleware';
import { DocumentNotFoundException } from '../exceptions/DocumentNotFoundException';
import { HttpException } from '../exceptions/HttpException';

export class DocumentsController implements Controller {
  public path = '/documents';
  public router = express.Router();
  private documentsService = new DocumentsService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .get(this.path, authMiddleware, this.getUserDocuments)
      .get(`${this.path}/:id`, this.getDocumentById)
      .post(
        this.path,
        authMiddleware,
        validationMiddleware(CreateDocumentDTO),
        this.createDocument
      )
      .patch(`${this.path}/:id`, this.updateDocument)
      .delete(`${this.path}/:id`, this.deleteDocument);
  }

  private getUserDocuments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user: User = req.user;
    const documents = await this.documentsService.getUserDocuments(user);

    if (documents) res.status(200).json(documents);
    else next(new HttpException(404, 'No documents found'));
  };

  private getDocumentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const {
      user,
      params: { id }
    } = req;
    const document = await this.documentsService.getDocumentById(id, user);

    if (document) res.status(200).json(document);
    else next(new DocumentNotFoundException(id));
  };

  private createDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const documentData: CreateDocumentDTO = req.body;
    const user: User = req.user;

    const newDocument = await this.documentsService.createDocument(
      documentData,
      user
    );

    res.status(200).json(newDocument);
  };

  private updateDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const {
      params: { id },
      body: { text },
      user
    } = req;
    const updatedDocument = await this.documentsService.updateDocument(
      id,
      text,
      user
    );

    if (updatedDocument) res.status(200).json(updatedDocument);
    else next(new DocumentNotFoundException(id));
  };

  private deleteDocument = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const {
      params: { id },
      user
    } = req;
    await this.documentsService.deleteDocument(id, user);
    res.status(200).json({ success: true });
  };
}
