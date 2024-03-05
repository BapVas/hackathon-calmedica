import { CategoryDocument } from './categories.types';

export const categories: { [key: string]: CategoryDocument } = {
  hotellerie: {
    name: 'hotellerie',
    score: null,
    responses: [],
  },
  sante: {
    name: 'sante',
    score: null,
    responses: [],
  },
  medicale: {
    name: 'medicale',
    score: null,
    responses: [],
  },
  relationnel: {
    name: 'relationnel',
    score: null,
    responses: [],
  },
  administratif: {
    name: 'administratif',
    score: null,
    responses: [],
  },
  not_in_category: {
    name: 'not_in_category',
    score: null,
    responses: [],
  },
  general: {
    name: 'general',
    score: null,
    responses: [],
  },
};

export const defaultCategory = categories['general'];
