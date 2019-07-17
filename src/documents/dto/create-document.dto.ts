import { Category } from '../document.category.enum';
import { IsNotEmpty } from 'class-validator';

export class CreateDocumentDTO {
  @IsNotEmpty()
  title!: string;

  @IsNotEmpty()
  text!: string;

  @IsNotEmpty()
  category!: Category;
}
