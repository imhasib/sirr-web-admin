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
import { useSetting, useUpdateSetting, usePromptSchemas, useTestPrompt } from '@/hooks/use-settings';
import { getPromptTestConfig, hasTestEndpoint } from '@/config/prompt-mappings';
import { SETTING_LABELS } from '@/types/setting';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { RequireAdmin } from '@/components/auth';

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

  // Fetch setting and schemas
  const { data: setting, isLoading, error } = useSetting(key);
  const { data: schemasData } = usePromptSchemas();
  const updateMutation = useUpdateSetting();
  const testMutation = useTestPrompt();

  // State
  const [promptValue, setPromptValue] = useState('');
  const [testInput, setTestInput] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Get configuration
  const promptLabel = SETTING_LABELS[key] || key;
  const outputSchema = schemasData?.schemas?.[key] || '';
  const testConfig = getPromptTestConfig(key);
  const showTestSection = hasTestEndpoint(key);

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
    if (!testConfig || !testInput.trim()) {
      toast.error('Please enter test input');
      return;
    }

    try {
      const result = await testMutation.mutateAsync({
        endpoint: testConfig.testEndpoint,
        data: { input: testInput },
      });

      const newResult: TestResult = {
        timestamp: result.timestamp || new Date().toISOString(),
        input: testInput,
        output: result.output,
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

  if (isLoading) {
    return (
      <RequireAdmin>
        <div className="container mx-auto py-8 space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 lg:col-span-2" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </RequireAdmin>
    );
  }

  if (error || !setting) {
    return (
      <RequireAdmin>
        <div className="container mx-auto py-8">
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load prompt setting'}
            </AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => router.push(ROUTES.PROMPT_SETTINGS)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Prompts
          </Button>
        </div>
      </RequireAdmin>
    );
  }

  return (
    <RequireAdmin>
      <div className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(ROUTES.PROMPT_SETTINGS)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{promptLabel}</h1>
            <p className="text-sm text-muted-foreground">{key}</p>
          </div>
          <Button
            onClick={handleUpdate}
            disabled={!hasChanges || isSaving}
            className="min-w-[120px]"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Update'}
          </Button>
        </div>

        {/* Warning Alert */}
        {hasChanges && (
          <Alert>
            <AlertDescription>
              You have unsaved changes. Click Update to save your changes.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content: Prompt Editor and Output Schema */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prompt Content (2/3 on desktop) */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Prompt Content</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(promptValue, 'Prompt')}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
              <CardDescription>
                Edit the prompt instructions. The output schema is automatically appended.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                className="min-h-[500px] font-mono text-sm"
                placeholder="Enter prompt content..."
              />
              <div className="mt-2 text-sm text-muted-foreground text-right">
                {promptValue.length} characters
              </div>
            </CardContent>
          </Card>

          {/* Output Schema (1/3 on desktop) */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Output Schema</CardTitle>
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
              <CardDescription>Expected output format (read-only)</CardDescription>
            </CardHeader>
            <CardContent>
              {outputSchema ? (
                <Textarea
                  value={outputSchema}
                  readOnly
                  className="min-h-[500px] font-mono text-sm bg-muted"
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
            <Separator className="my-8" />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube2 className="h-5 w-5" />
                  Test Prompt
                </CardTitle>
                <CardDescription>{testConfig.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Test Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Test Input</label>
                  <Textarea
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="Enter test input (plain text)..."
                    className="min-h-[120px] font-mono text-sm"
                  />
                </div>

                <Button
                  onClick={handleTest}
                  disabled={!testInput.trim() || testMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  <TestTube2 className="h-4 w-4 mr-2" />
                  {testMutation.isPending ? 'Testing...' : 'Test Prompt'}
                </Button>

                {/* Test Results History */}
                {testResults.length > 0 && (
                  <div className="space-y-4 mt-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Test Results History</h3>
                      <span className="text-xs text-muted-foreground">
                        Last {testResults.length} test{testResults.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {testResults.map((result, index) => (
                        <Card key={result.timestamp} className={cn(index === 0 && 'border-primary')}>
                          <CardHeader className="pb-3">
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
                                onClick={() =>
                                  copyToClipboard(
                                    JSON.stringify(result.output, null, 2),
                                    'Output'
                                  )
                                }
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <p className="text-xs font-medium mb-1">Input:</p>
                              <p className="text-sm bg-muted p-2 rounded font-mono">
                                {result.input}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium mb-1">Output:</p>
                              <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-[300px] font-mono">
                                {JSON.stringify(result.output, null, 2)}
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
