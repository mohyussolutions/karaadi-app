import type { PlanDefinition } from '../util/types/planCatalog.types';

export const PLAN_CATALOG: PlanDefinition[] = [
  {
    key: 'premium90',
    label: 'Premium',
    days: 90,
    popular: false,
    features: ['90 Maalmood', 'Social Media Boost', 'Safka hore (Top)', 'Taageero 24/7 ah'],
  },
  {
    key: 'standard60',
    label: 'Standard',
    days: 60,
    popular: true,
    features: ['60 Maalmood', 'Raadinta sare', 'Sawirro & Muuqaal', 'Taageero chat'],
  },
  {
    key: 'basic30',
    label: 'Basic',
    days: 30,
    popular: false,
    features: ['30 Maalmood', 'Raadinta aasaasiga ah', 'Taageero email'],
  },
];
