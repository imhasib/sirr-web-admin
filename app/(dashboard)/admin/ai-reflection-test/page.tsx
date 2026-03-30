'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { aiReflectionService, AIReflectionResponse } from '@/services/ai-reflection.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PageHeader } from '@/components/common';
import { RequireAdmin } from '@/components/auth';
import { Loader2, Sparkles, BookOpen, Eye, Lightbulb, Star } from 'lucide-react';

const promptSchema = z.object({
  prompt: z
    .string()
    .min(10, 'Prompt must be at least 10 characters')
    .max(5000, 'Prompt must be less than 5000 characters'),
});

type PromptFormValues = z.infer<typeof promptSchema>;

export default function AIReflectionTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AIReflectionResponse | null>(null);

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const onSubmit = async (values: PromptFormValues) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await aiReflectionService.testReflection(values);
      setResponse(result);
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      if (error.statusCode === 401) {
        setError('Unauthorized. Please log in again.');
      } else if (error.statusCode === 403) {
        setError('Forbidden. You do not have permission to access this resource.');
      } else if (error.statusCode === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(error.message || 'An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RequireAdmin pageTitle="AI Reflection Test">
    <div className="space-y-6">
      <PageHeader
        title="AI Reflection Test"
        description="Test AI reflection generation with custom journal prompts"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Test Prompt
          </CardTitle>
          <CardDescription>
            Enter a journal prompt to generate an AI reflection response
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Journal Prompt *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your journal prompt here... (e.g., I've been feeling overwhelmed with work lately and struggling to find balance...)"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0} / 5000 characters (minimum 10)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Reflection
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {response && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Main Reflection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {response.mainReflection}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Islamic Lens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {response.islamicLens}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Pattern Identified
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {response.patternIdentified}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Your Invitation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {response.yourInvitation}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Name of Allah
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-arabic">{response.nameOfAllah.arabic}</span>
                  <div>
                    <p className="font-semibold">{response.nameOfAllah.transliteration}</p>
                    <p className="text-sm text-muted-foreground">{response.nameOfAllah.meaning}</p>
                  </div>
                </div>
                <div className="space-y-3 border-t pt-4">
                  <div>
                    <h4 className="font-medium mb-1">Reflection</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {response.nameOfAllah.reflection}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Embodiment</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {response.nameOfAllah.embodiment}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </RequireAdmin>
  );
}
