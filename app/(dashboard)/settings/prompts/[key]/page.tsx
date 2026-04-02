'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, TestTube2, Copy, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useSetting, useUpdateSetting, useTestPrompt } from '@/hooks/use-settings';
import { getPromptTestConfig, hasTestEndpoint } from '@/config/prompt-mappings';
import { PromptSetting } from '@/types/setting';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { RequireAdmin } from '@/components/auth';
import { Input } from '@/components/ui/input';

interface TestResult {
  timestamp: string;
  input: string;
  output: any;
}

// LocalStorage key for drafts
const DRAFT_KEY_PREFIX = 'prompt_draft_';

export default function PromptEditPage() {
  const params = useParams();
  const router = useRouter();
  const key = params.key as string;

  // Fetch setting
  const { data: setting, isLoading, error } = useSetting(key);
  const updateMutation = useUpdateSetting();
  const testMutation = useTestPrompt();

  // State
  const [promptValue, setPromptValue] = useState('');
  const [testInput, setTestInput] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Allah insights specific state
  const [allahName, setAllahName] = useState('');
  const [allahMeaning, setAllahMeaning] = useState('');
  const [journalEntry1, setJournalEntry1] = useState('');
  const [journalEntry2, setJournalEntry2] = useState('');

  // Get configuration
  const promptSetting = setting as PromptSetting | undefined;
  const promptLabel = promptSetting?.label || key;
  const outputSchema = promptSetting?.outputSchema || '';
  const testConfig = getPromptTestConfig(key);
  const showTestSection = hasTestEndpoint(key);

  // Sample inputs for different prompt types
  const getSampleInput = () => {
    if (!testConfig) return '';

    switch (testConfig.inputType) {
      case 'partial-entry':
        return 'I felt so grateful today when my friend helped me through a difficult time';
      case 'main-reflection':
        return 'Today I felt overwhelmed by my responsibilities at work and home. I\'m struggling to find balance.';
      default:
        return '';
    }
  };

  // Initialize sample inputs based on prompt type
  useEffect(() => {
    if (testConfig) {
      if (testConfig.inputType === 'partial-entry' || testConfig.inputType === 'main-reflection') {
        setTestInput(getSampleInput());
      } else if (testConfig.inputType === 'allah-insights') {
        setAllahName('Ar-Rahman');
        setAllahMeaning('The Most Merciful');
        setJournalEntry1('Today I struggled with forgiving myself for past mistakes');
        setJournalEntry2('I felt Allah\'s mercy when I made dua after Fajr');
      }
    }
  }, [key, testConfig]);

  // Load draft from localStorage
  useEffect(() => {
    const draftKey = `${DRAFT_KEY_PREFIX}${key}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft && !setting) {
      setPromptValue(savedDraft);
    }
  }, [key, setting]);

  // Set initial value when setting loads
  useEffect(() => {
    if (setting?.value) {
      setPromptValue(setting.value);
    }
  }, [setting]);

  // Auto-save draft to localStorage
  useEffect(() => {
    if (promptValue && promptValue !== setting?.value) {
      const draftKey = `${DRAFT_KEY_PREFIX}${key}`;
      localStorage.setItem(draftKey, promptValue);
    }
  }, [promptValue, key, setting?.value]);

  // Load test history from localStorage
  useEffect(() => {
    const historyKey = `prompt_test_history_${key}`;
    const savedHistory = localStorage.getItem(historyKey);
    if (savedHistory) {
      try {
        setTestResults(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse test history:', e);
      }
    }
  }, [key]);

  const hasChanges = promptValue !== setting?.value;

  const handleUpdate = async () => {
    if (!hasChanges || !setting) return;

    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        key,
        data: {
          value: promptValue,
          type: setting.type,
          description: setting.description,
        },
      });

      // Clear draft from localStorage on successful save
      const draftKey = `${DRAFT_KEY_PREFIX}${key}`;
      localStorage.removeItem(draftKey);
    } catch (error) {
      console.error('Failed to update prompt:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    if (!testConfig) {
      toast.error('Test configuration not found');
      return;
    }

    // Validate inputs based on input type
    if (testConfig.inputType === 'partial-entry' || testConfig.inputType === 'main-reflection') {
      if (!testInput.trim()) {
        toast.error('Please enter test input');
        return;
      }
    } else if (testConfig.inputType === 'allah-insights') {
      if (!allahName.trim() || !allahMeaning.trim() || (!journalEntry1.trim() && !journalEntry2.trim())) {
        toast.error('Please fill in all required fields (Allah Name, Meaning, and at least one journal entry)');
        return;
      }
    }

    try {
      // Build request data based on input type
      let requestData: any;
      let inputSummary: string;

      if (testConfig.inputType === 'partial-entry') {
        requestData = { partialEntry: testInput };
        inputSummary = testInput;
      } else if (testConfig.inputType === 'main-reflection') {
        requestData = { prompt: testInput };
        inputSummary = testInput;
      } else if (testConfig.inputType === 'allah-insights') {
        const journalEntries = [journalEntry1, journalEntry2].filter(entry => entry.trim());
        requestData = {
          allahName,
          allahMeaning,
          journalEntries,
        };
        inputSummary = `${allahName} (${allahMeaning}) - ${journalEntries.length} entries`;
      }

      const result = await testMutation.mutateAsync({
        endpoint: testConfig.testEndpoint,
        data: requestData,
      });

      // Handle response - API may return data directly or wrapped in output field
      const outputData = result.output || result;

      const newResult: TestResult = {
        timestamp: result.timestamp || new Date().toISOString(),
        input: inputSummary,
        output: outputData,
      };

      // Add to test results (keep last 5)
      const updatedResults = [newResult, ...testResults].slice(0, 5);
      setTestResults(updatedResults);

      // Save to localStorage
      const historyKey = `prompt_test_history_${key}`;
      localStorage.setItem(historyKey, JSON.stringify(updatedResults));

      toast.success('Prompt tested successfully');
    } catch (error) {
      console.error('Failed to test prompt:', error);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  // Format output for display
  const formatOutput = (output: any): string => {
    if (!output) return 'No output';

    // If it's a string, return as is
    if (typeof output === 'string') return output;

    // For objects, try to format them nicely
    try {
      // Check if it's a structured response with specific fields
      if (typeof output === 'object') {
        let formatted = '';

        // Handle different response structures
        Object.entries(output).forEach(([key, value]) => {
          // Convert camelCase to Title Case
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

          if (typeof value === 'object' && value !== null) {
            formatted += `\n${label}:\n`;
            Object.entries(value).forEach(([subKey, subValue]) => {
              const subLabel = subKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              formatted += `  ${subLabel}: ${subValue}\n`;
            });
          } else {
            formatted += `${label}: ${value}\n\n`;
          }
        });

        return formatted.trim();
      }

      // Fallback to JSON
      return JSON.stringify(output, null, 2);
    } catch (e) {
      return JSON.stringify(output, null, 2);
    }
  };

  if (isLoading) {
    return (
      <RequireAdmin>
        <div className="container mx-auto py-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Skeleton className="h-[350px] lg:col-span-2" />
            <Skeleton className="h-[350px]" />
          </div>
        </div>
      </RequireAdmin>
    );
  }

  if (error || !setting) {
    return (
      <RequireAdmin>
        <div className="container mx-auto py-6">
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load prompt setting'}
            </AlertDescription>
          </Alert>
          <Button className="mt-4" size="sm" onClick={() => router.push(ROUTES.PROMPT_SETTINGS)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Prompts
          </Button>
        </div>
      </RequireAdmin>
    );
  }

  return (
    <RequireAdmin>
      <div className="container mx-auto py-6 space-y-4">
        {/* Compact Header */}
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(ROUTES.PROMPT_SETTINGS)}
            className="mt-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{promptLabel}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{key}</p>
          </div>
        </div>

        {/* Main Content: Prompt Editor and Output Schema */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Prompt Content (2/3 on desktop) */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Prompt Content</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(promptValue, 'Prompt')}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
              <CardDescription className="text-xs">
                Edit the prompt instructions. The output schema is automatically appended.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                className="h-[250px] font-mono text-sm resize-y"
                placeholder="Enter prompt content..."
              />
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {promptValue.length} characters
                </div>
                <Button
                  onClick={handleUpdate}
                  disabled={!hasChanges || isSaving}
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Update Prompt'}
                </Button>
              </div>
              {hasChanges && (
                <Alert className="py-2">
                  <AlertDescription className="text-xs">
                    You have unsaved changes. Click "Update Prompt" to save your changes.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Output Schema (1/3 on desktop) */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Output Schema</CardTitle>
                {outputSchema && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(outputSchema, 'Schema')}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                )}
              </div>
              <CardDescription className="text-xs">Expected output format (read-only)</CardDescription>
            </CardHeader>
            <CardContent>
              {outputSchema ? (
                <Textarea
                  value={outputSchema}
                  readOnly
                  className="h-[250px] font-mono text-sm bg-muted resize-y"
                />
              ) : (
                <div className="text-sm text-muted-foreground">
                  No output schema defined for this prompt.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test Section */}
        {showTestSection && testConfig && (
          <>
            <Separator className="my-6" />

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TestTube2 className="h-5 w-5" />
                  Test Prompt
                </CardTitle>
                <CardDescription className="text-xs">{testConfig.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Disabled State Warning */}
                {hasChanges && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription className="text-xs">
                      <strong>Testing Disabled:</strong> You have unsaved changes to the prompt. Please save your changes first to ensure accurate test results with the updated prompt.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Test Input - Partial Entry & Main Reflection (both use simple text input) */}
                {(testConfig.inputType === 'partial-entry' || testConfig.inputType === 'main-reflection') && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Test Input (Sample provided - edit as needed)</label>
                    <Textarea
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder="Enter test input (plain text)..."
                      className="min-h-[120px] font-mono text-sm resize-none"
                      disabled={hasChanges}
                    />
                  </div>
                )}

                {/* Test Input - Allah Insights */}
                {testConfig.inputType === 'allah-insights' && (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">Sample data provided - edit as needed</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Allah Name</label>
                        <Input
                          type="text"
                          value={allahName}
                          onChange={(e) => setAllahName(e.target.value)}
                          placeholder="e.g., Ar-Rahman"
                          className="text-sm"
                          disabled={hasChanges}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Allah Meaning</label>
                        <Input
                          type="text"
                          value={allahMeaning}
                          onChange={(e) => setAllahMeaning(e.target.value)}
                          placeholder="e.g., The Most Merciful"
                          className="text-sm"
                          disabled={hasChanges}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Journal Entry 1</label>
                      <Textarea
                        value={journalEntry1}
                        onChange={(e) => setJournalEntry1(e.target.value)}
                        placeholder="Enter first journal entry..."
                        className="min-h-[80px] font-mono text-sm resize-none"
                        disabled={hasChanges}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Journal Entry 2 (Optional)</label>
                      <Textarea
                        value={journalEntry2}
                        onChange={(e) => setJournalEntry2(e.target.value)}
                        placeholder="Enter second journal entry..."
                        className="min-h-[80px] font-mono text-sm resize-none"
                        disabled={hasChanges}
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleTest}
                  disabled={hasChanges || testMutation.isPending}
                  className="w-full sm:w-auto"
                  size="sm"
                >
                  <TestTube2 className="h-4 w-4 mr-2" />
                  {testMutation.isPending ? 'Testing...' : 'Test Prompt'}
                </Button>

                {/* Test Results History */}
                {testResults.length > 0 && (
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Test Results History</h3>
                      <span className="text-xs text-muted-foreground">
                        Last {testResults.length} test{testResults.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {testResults.map((result, index) => (
                        <Card key={result.timestamp} className={cn(index === 0 && 'border-primary', 'shadow-sm')}>
                          <CardHeader className="pb-2 pt-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {new Date(result.timestamp).toLocaleString()}
                                {index === 0 && (
                                  <span className="text-primary font-medium">(Latest)</span>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() =>
                                  copyToClipboard(
                                    formatOutput(result.output),
                                    'Output'
                                  )
                                }
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2 pb-3">
                            <div>
                              <p className="text-xs font-medium mb-1">Input:</p>
                              <p className="text-xs bg-muted p-2 rounded font-mono">
                                {result.input}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium mb-1">Output:</p>
                              <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-[400px] whitespace-pre-wrap font-mono leading-relaxed">
                                {formatOutput(result.output)}
                              </pre>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </RequireAdmin>
  );
}
