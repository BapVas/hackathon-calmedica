import { CategoryDocument } from './categories.types';

export const categories: { [key: string]: CategoryDocument } = {
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
  hotelier: {
    name: 'hotelier',
    score: null,
    responses: [],
  },
  organisationnel: {
    name: 'organisationnel',
    score: null,
    responses: [],
  },
  general: {
    name: 'general',
    score: null,
    responses: [],
  },
  not_in_category: {
    name: 'en attente',
    score: null,
    responses: [],
  },
};

export const defaultCategory = categories['general'];
