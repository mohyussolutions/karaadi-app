export interface ReviewAuthor {
  id: string;
  username: string;
  profileImage?: string | null;
}

export interface Review {
  id: string;
  userId: string;
  itemId: string;
  itemType: string;
  rating: number;
  content: string;
  createdAt: string;
  user?: ReviewAuthor;
}

export interface CreateReviewPayload {
  itemId: string;
  itemType: string;
  rating: number;
  content: string;
}
