'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useOnboardingQuestion, useUpdateOnboardingQuestion } from '@/hooks/use-onboarding';
import { useAuthStore } from '@/stores/auth-store';
import { SelectionType, UpdateOnboardingQuestionRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/common';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const optionSchema = z.object({
  slug: z.string().min(1, 'Option slug is required'),
  label: z.string().min(1, 'Option label is required'),
  description: z.string().optional(),
});

const questionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  subtitle: z.string().max(500, 'Subtitle must be less than 500 characters').optional(),
  stepLabel: z.string().max(100, 'Step label must be less than 100 characters').optional(),
  selectionType: z.enum(['single', 'multiple']),
  minSelections: z.coerce.number().min(0, 'Min selections must be at least 0').default(1),
  order: z.coerce.number().min(0, 'Order must be at least 0').default(0),
  isActive: z.boolean().default(true),
  options: z.array(optionSchema).min(1, 'At least one option is required'),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

export default function EditOnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { user } = useAuthStore();
  const { data, isLoading, error } = useOnboardingQuestion(slug);
  const updateQuestion = useUpdateOnboardingQuestion();

  const isAdmin = user?.role === 'admin';
  const question = data;

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      stepLabel: '',
      selectionType: 'single',
      minSelections: 1,
      order: 0,
      isActive: true,
      options: [{ slug: '', label: '', description: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options',
  });

  useEffect(() => {
    if (question) {
      form.reset({
        title: question.title,
        subtitle: question.subtitle || '',
        stepLabel: question.stepLabel || '',
        selectionType: question.selectionType,
        minSelections: question.minSelections,
        order: question.order,
        isActive: question.isActive,
        options: question.options.map((opt) => ({
          slug: opt.slug,
          label: opt.label,
          description: opt.description || '',
        })),
      });
    }
  }, [question, form]);

  const onSubmit = async (values: QuestionFormValues) => {
    const data: UpdateOnboardingQuestionRequest = {
      title: values.title,
      subtitle: values.subtitle || undefined,
      stepLabel: values.stepLabel || undefined,
      selectionType: values.selectionType,
      minSelections: values.minSelections,
      order: values.order,
      isActive: values.isActive,
      options: values.options.map((opt) => ({
        slug: opt.slug,
        label: opt.label,
        description: opt.description || undefined,
      })),
    };
    await updateQuestion.mutateAsync({ slug, data });
    router.push(`/admin/onboarding/${slug}`);
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Question" backHref="/admin/onboarding" />
        <Alert variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Question" backHref="/admin/onboarding" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Question" backHref="/admin/onboarding" />
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load question details. The question may not exist.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Question"
        description={`Editing: ${question.title}`}
        backHref={`/admin/onboarding/${slug}`}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Question Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground">Slug (cannot be changed)</p>
                <p className="font-mono">{question.slug}</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormDescription>Display order (lower = first)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <FormDescription>
                          Show this question in onboarding flow
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="What are your primary goals?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Select the options that apply to you"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stepLabel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Step Label</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., About You — 1 of 3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="selectionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selection Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={SelectionType.SINGLE}>Single</SelectItem>
                          <SelectItem value={SelectionType.MULTIPLE}>Multiple</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minSelections"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Selections</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Options</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ slug: '', label: '', description: '' })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="rounded-lg border p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Option {index + 1}</span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`options.${index}.slug`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug *</FormLabel>
                          <FormControl>
                            <Input placeholder="option_slug" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`options.${index}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label *</FormLabel>
                          <FormControl>
                            <Input placeholder="Option Label" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`options.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Optional description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/admin/onboarding/${slug}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateQuestion.isPending}>
              {updateQuestion.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Question
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
