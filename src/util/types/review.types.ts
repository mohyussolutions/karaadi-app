import type { ItemRef } from './generic.types';

export interface ReviewAuthor {
  id: string;
  username: string;
  profileImage?: string | null;
}

interface ReviewCore extends ItemRef {
  rating: number;
  content: string;
}

export interface Review extends ReviewCore {
  id: string;
  userId: string;
  createdAt: string;
  user?: ReviewAuthor;
}

export interface CreateReviewPayload extends ReviewCore {}
