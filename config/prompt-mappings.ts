/**
 * Prompt configuration mappings for test endpoints and schemas
 */

export type PromptInputType = 'partial-entry' | 'main-reflection' | 'allah-insights';

export interface PromptConfig {
  testEndpoint: string;
  description: string;
  inputType: PromptInputType;
}

/**
 * Mapping of prompt keys to their test endpoints and configurations
 * If a prompt key is not in this mapping, the test section will be hidden
 */
export const PROMPT_TEST_CONFIG: Record<string, PromptConfig> = {
  SYSTEM_PROMPT_MAIN_REFLECTION: {
    testEndpoint: '/admin/prompts/test/main-reflection',
    description: 'Test full reflection generation',
    inputType: 'main-reflection',
  },
  SYSTEM_PROMPT_HELP_ME_REFLECT: {
    testEndpoint: '/admin/prompts/test/help-me-reflect',
    description: 'Test reflection question generation',
    inputType: 'partial-entry',
  },
  SYSTEM_PROMPT_DETECT_EMOTIONS_TAGS: {
    testEndpoint: '/admin/prompts/test/detect-emotions-tags',
    description: 'Test emotion/tag detection',
    inputType: 'partial-entry',
  },
  SYSTEM_PROMPT_ALLAH_PERSONALIZED_INSIGHTS: {
    testEndpoint: '/admin/prompts/test/allah-personalized-insights',
    description: 'Test Allah insights generation',
    inputType: 'allah-insights',
  },
};

/**
 * Check if a prompt key has test functionality available
 */
export function hasTestEndpoint(key: string): boolean {
  return key in PROMPT_TEST_CONFIG;
}

/**
 * Get test configuration for a prompt key
 */
export function getPromptTestConfig(key: string): PromptConfig | undefined {
  return PROMPT_TEST_CONFIG[key];
}
