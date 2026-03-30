'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateLibrary } from '@/hooks/use-libraries';
import { CreateLibraryRequest } from '@/types';
import { librarySchema, type LibraryFormData } from '@/lib/schemas';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/common';
import { RequireAdmin } from '@/components/auth';
import { Loader2 } from 'lucide-react';

export default function NewLibraryPage() {
  const router = useRouter();
  const createLibrary = useCreateLibrary();

  const form = useForm<LibraryFormData>({
    resolver: zodResolver(librarySchema),
    defaultValues: {
      name: '',
      description: '',
      link: '',
      duration: 0,
      category: '',
      premium: true,
    },
  });

  const onSubmit = async (values: LibraryFormData) => {
    const data: CreateLibraryRequest = {
      ...values,
      category: values.category as CreateLibraryRequest['category'],
    };
    await createLibrary.mutateAsync(data);
    router.push('/admin/libraries');
  };

  return (
    <RequireAdmin
      pageTitle="Add Library"
      backHref="/admin/libraries"
    >
    <div className="space-y-6">
      <PageHeader
        title="Add Library"
        description="Create a new library resource"
        backHref="/admin/libraries"
      />

      <Card>
        <CardHeader>
          <CardTitle>Library Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter library name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link *</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/resource" {...field} />
                      </FormControl>
                      <FormDescription>URL to the library resource</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Duration in minutes"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="premium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Type</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === 'true')}
                        defaultValue={field.value ? 'true' : 'false'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Premium</SelectItem>
                          <SelectItem value="false">Free</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter library description"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0} / 2000 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/libraries')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createLibrary.isPending}>
                  {createLibrary.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Library
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      </div>
    </RequireAdmin>
  );
}
