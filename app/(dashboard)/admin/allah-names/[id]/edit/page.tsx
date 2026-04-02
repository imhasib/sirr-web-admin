'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAllahName, useUpdateAllahName } from '@/hooks/use-allah-names';
import { UpdateAllahNameRequest } from '@/types';
import { allahNameSchema, type AllahNameFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
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
import { Loader2, Plus, Trash2 } from 'lucide-react';

export default function EditAllahNamePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, error } = useAllahName(id);
  const updateAllahName = useUpdateAllahName();

  const allahName = data;

  const form = useForm<AllahNameFormData>({
    resolver: zodResolver(allahNameSchema),
    defaultValues: {
      transliteration: '',
      arabic: '',
      meaning: '',
      intro: '',
      quranicReferences: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'quranicReferences',
  });

  useEffect(() => {
    if (allahName) {
      form.reset({
        transliteration: allahName.transliteration,
        arabic: allahName.arabic,
        meaning: allahName.meaning,
        intro: allahName.intro,
        quranicReferences: allahName.quranicReferences || [],
      });
    }
  }, [allahName, form]);

  const onSubmit = async (values: AllahNameFormData) => {
    const data: UpdateAllahNameRequest = {
      transliteration: values.transliteration,
      arabic: values.arabic,
      meaning: values.meaning,
      intro: values.intro,
      quranicReferences:
        values.quranicReferences?.length ? values.quranicReferences : undefined,
    };
    await updateAllahName.mutateAsync({ id, data });
    router.push(`/admin/allah-names/${id}`);
  };

  if (isLoading) {
    return (
      <RequireAdmin pageTitle="Edit Allah Name" backHref="/admin/allah-names">
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
      </RequireAdmin>
    );
  }

  if (error || !allahName) {
    return (
      <RequireAdmin pageTitle="Edit Allah Name" backHref="/admin/allah-names">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load Allah name details. The entry may not exist.
          </AlertDescription>
        </Alert>
      </RequireAdmin>
    );
  }

  return (
    <RequireAdmin pageTitle="Edit Allah Name" backHref="/admin/allah-names">
      <div className="space-y-6">
        <PageHeader
          title="Edit Allah Name"
          description={`Editing: ${allahName.transliteration}`}
          backHref={`/admin/allah-names/${id}`}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="transliteration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transliteration *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Ar-Rahman" {...field} />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length || 0} / 100 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="arabic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arabic *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="الرَّحْمَنُ"
                            dir="rtl"
                            lang="ar"
                            className="text-right font-arabic text-lg"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length || 0} / 100 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="meaning"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meaning *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., The Most Merciful" {...field} />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0} / 200 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="intro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Introduction *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed explanation of this Beautiful Name..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0} / 5000 characters (min 10)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Quranic References</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ verse: '', surah: '', number: '' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reference
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No Quranic references added yet. Click "Add Reference" to add one.
                  </p>
                ) : (
                  fields.map((field, index) => (
                    <div key={field.id} className="rounded-lg border p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Reference {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`quranicReferences.${index}.surah`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Surah *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Al-Fatiha" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`quranicReferences.${index}.number`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 1:1 or 55:1-2" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`quranicReferences.${index}.verse`}
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Verse Text *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="The verse text from the Quran..."
                                  className="min-h-[80px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/admin/allah-names/${id}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateAllahName.isPending}>
                {updateAllahName.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Allah Name
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </RequireAdmin>
  );
}
