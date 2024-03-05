import { CategoryDocument } from './categories.types';

// export type Responses = {
//   id: string;
//   content: string;
//   score: number;
//   isAnalysed: boolean;
//   shouldBeAnalysed: boolean;
// };

export type ResponsesDocument = {
  id: string;
  content: string;
  score: number;
  isAnalysed: boolean;
  shouldBeAnalysed: boolean;
  categories: CategoryDocument[];
  date: Date;
};
