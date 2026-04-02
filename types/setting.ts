export type SettingType = 'string' | 'number' | 'boolean' | 'json' | 'text';

export interface Setting {
  _id: string;
  key: string;
  value: string;
  type: SettingType;
  category: string;
  label: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingRequest {
  value: string;
  type?: SettingType;
  description?: string;
}

export interface PromptSetting extends Setting {
  outputSchema?: string;
}
