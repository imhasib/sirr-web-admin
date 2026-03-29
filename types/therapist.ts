export const TherapistGender = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
} as const;

export type TherapistGenderType = (typeof TherapistGender)[keyof typeof TherapistGender];

export interface Therapist {
  _id: string;
  userId?: string;
  name: string;
  title?: string;
  description?: string;
  gender?: TherapistGenderType;
  tags?: string[];
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTherapistRequest {
  userId?: string;
  name: string;
  title?: string;
  description?: string;
  gender?: TherapistGenderType;
  tags?: string[];
  photo?: string;
}

export interface UpdateTherapistRequest extends Partial<CreateTherapistRequest> {}

export interface TherapistListParams {
  page?: number;
  limit?: number;
  gender?: TherapistGenderType;
  tag?: string | string[];
}

export interface TherapistListResponse {
  success: boolean;
  data: {
    profiles: Therapist[];
    total: number;
    page: number;
    totalPages: number;
  };
}
