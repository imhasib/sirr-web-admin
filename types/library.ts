export const LibraryCategory = {
  STRESS_AND_BURNOUT: 'Stress & Burnout',
  FAITH_AND_HEALING: 'Faith & Healing',
  RELATIONSHIP: 'Relationship',
  ANXIETY_AND_OCD: 'Anxiety & OCD',
  DEPRESSION: 'Depression',
  MENTAL_HEALTH: 'Mental Health',
  SPIRITUALITY: 'Spirituality',
  WELLNESS: 'Wellness',
} as const;

export type LibraryCategoryType = (typeof LibraryCategory)[keyof typeof LibraryCategory];

export interface Library {
  _id: string;
  name: string;
  description: string;
  link: string;
  duration: string;
  category: LibraryCategoryType;
  premium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLibraryRequest {
  name: string;
  description: string;
  link: string;
  duration: string;
  category: LibraryCategoryType;
  premium?: boolean;
}

export interface UpdateLibraryRequest extends Partial<CreateLibraryRequest> {}

export interface LibraryCategoryGroup {
  name: LibraryCategoryType;
  totalItem: number;
  libraries: Library[];
}

export interface LibraryListResponse {
  categories: LibraryCategoryGroup[];
}
