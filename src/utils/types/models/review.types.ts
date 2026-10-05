import type { ItemRef } from '../api/api.types';

export interface ReviewAuthor {
  id: string;
  username: string;
  profileImage?: string | null;
}

export interface ReviewCore extends ItemRef {
  rating: number;
  content: string;
}

export interface Review extends ReviewCore {
  id: string;
  userId: string;
  createdAt: string;
  user?: ReviewAuthor;
}
