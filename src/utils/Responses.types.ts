import { CategoryDocument } from './categories.types';

export type ResponsesRow = {
  id: string;
  content: string;
};

export type ResponsesDocument = {
  id: string;
  content: string;
  isAnalysed: boolean;
  shouldBeAnalysed: boolean;
  categories: CategoryDocument[];
  date: Date;
};
