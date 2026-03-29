'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateTherapist } from '@/hooks/use-therapists';
import { useAuthStore } from '@/stores/auth-store';
import { TherapistGender, CreateTherapistRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/common';
import { Loader2 } from 'lucide-react';

const therapistSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  title: z.string().max(100, 'Title must be less than 100 characters').optional(),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  gender: z.string().optional(),
  tags: z.string().optional(),
  photo: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  userId: z.string().optional(),
});

type TherapistFormValues = z.infer<typeof therapistSchema>;

export default function NewTherapistPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const createTherapist = useCreateTherapist();

  const isAdmin = user?.role === 'admin';

  const form = useForm<TherapistFormValues>({
    resolver: zodResolver(therapistSchema),
    defaultValues: {
      name: '',
      title: '',
      description: '',
      gender: '',
      tags: '',
      photo: '',
      userId: '',
    },
  });

  const onSubmit = async (values: TherapistFormValues) => {
    const data: CreateTherapistRequest = {
      name: values.name,
      title: values.title || undefined,
      description: values.description || undefined,
      gender: values.gender as CreateTherapistRequest['gender'],
      tags: values.tags ? values.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      photo: values.photo || undefined,
      userId: values.userId || undefined,
    };
    await createTherapist.mutateAsync(data);
    router.push('/admin/therapists');
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <PageHeader title="Add Therapist" backHref="/admin/therapists" />
        <Alert variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Therapist"
        description="Create a new therapist profile"
        backHref="/admin/therapists"
      />

      <Card>
        <CardHeader>
          <CardTitle>Therapist Details</CardTitle>
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
                        <Input placeholder="Enter therapist name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Licensed Therapist" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(TherapistGender).map(([key, value]) => (
                            <SelectItem key={value} value={value} className="capitalize">
                              {key.charAt(0) + key.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="photo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/photo.jpg" {...field} />
                      </FormControl>
                      <FormDescription>URL to the therapist&apos;s profile photo</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Specializations</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Anxiety, Depression, Relationships"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter specializations separated by commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>User ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Link to existing user (optional)" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional: Link this therapist to an existing user account
                      </FormDescription>
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter therapist bio/description"
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
                  onClick={() => router.push('/admin/therapists')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createTherapist.isPending}>
                  {createTherapist.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Therapist
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
