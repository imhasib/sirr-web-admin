'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateAllahName } from '@/hooks/use-allah-names';
import { CreateAllahNameRequest } from '@/types';
import { allahNameSchema, type AllahNameFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

export default function NewAllahNamePage() {
  const router = useRouter();
  const createAllahName = useCreateAllahName();

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

  const onSubmit = async (values: AllahNameFormData) => {
    const data: CreateAllahNameRequest = {
      transliteration: values.transliteration,
      arabic: values.arabic,
      meaning: values.meaning,
      intro: values.intro,
      quranicReferences:
        values.quranicReferences?.length ? values.quranicReferences : undefined,
    };
    await createAllahName.mutateAsync(data);
    router.push('/admin/allah-names');
  };

  return (
    <RequireAdmin pageTitle="Add Allah Name" backHref="/admin/allah-names">
      <div className="space-y-6">
        <PageHeader
          title="Add Allah Name"
          description="Add one of Allah's Beautiful Names with meaning and references"
          backHref="/admin/allah-names"
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
                <CardTitle>Quranic References (Optional)</CardTitle>
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
                onClick={() => router.push('/admin/allah-names')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createAllahName.isPending}>
                {createAllahName.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Allah Name
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </RequireAdmin>
  );
}
