export interface Feedback {
  _id: string;
  userId?: string;
  name: string;
  email: string;
  message: string;
  screenName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackListParams {
  page?: number;
  limit?: number;
}

export interface FeedbackListResponse {
  feedbacks: Feedback[];
  total: number;
  page: number;
  totalPages: number;
}
