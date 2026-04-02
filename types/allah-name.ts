export interface QuranicReference {
  verse: string;
  surah: string;
  number: string;
}

export interface AllahName {
  _id: string;
  transliteration: string;
  arabic: string;
  meaning: string;
  intro: string;
  quranicReferences: QuranicReference[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAllahNameRequest {
  transliteration: string;
  arabic: string;
  meaning: string;
  intro: string;
  quranicReferences?: QuranicReference[];
}

export interface UpdateAllahNameRequest extends Partial<CreateAllahNameRequest> {
  isActive?: boolean;
}

export interface AllahNameListParams {
  page?: number;
  limit?: number;
  includeInactive?: boolean;
}
