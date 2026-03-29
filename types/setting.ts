export type SettingType = 'string' | 'number' | 'boolean' | 'json' | 'text';

export interface Setting {
  _id: string;
  key: string;
  value: string;
  type: SettingType;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingRequest {
  value: string;
  type?: SettingType;
  description?: string;
}

// Friendly display names for setting keys
export const SETTING_LABELS: Record<string, string> = {
  SYSTEM_PROMPT_MAIN_REFLECTION: 'Soul Mirror Reflection Prompt',
  SYSTEM_PROMPT_HELP_ME_REFLECT: 'Help Me Reflect Prompt',
  SYSTEM_PROMPT_DETECT_EMOTIONS_TAGS: 'Emotion & Tag Detection Prompt',
};

// Get friendly label for a setting key
export function getSettingLabel(key: string): string {
  return SETTING_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
