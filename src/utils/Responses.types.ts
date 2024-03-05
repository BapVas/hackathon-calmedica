import { CategoryDocument } from './categories.types';

export type ResponsesRow = {
  id: string;
  content: string;
};

export type ResponsesDocument = {
  _id?: string;
  __v?: number;
  id: string;
  content: string;
  isAnalysed: boolean;
  shouldBeAnalysed: boolean;
  categories: CategoryDocument[];
  date: Date;

  [key: string]: any;
};
