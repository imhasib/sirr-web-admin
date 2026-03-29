'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTherapist, useUpdateTherapist } from '@/hooks/use-therapists';
import { useAuthStore } from '@/stores/auth-store';
import { TherapistGender, UpdateTherapistRequest } from '@/types';
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

export default function EditTherapistPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { user } = useAuthStore();
  const { data, isLoading, error } = useTherapist(id);
  const updateTherapist = useUpdateTherapist();

  const isAdmin = user?.role === 'admin';
  const therapist = data?.data;

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

  useEffect(() => {
    if (therapist) {
      form.reset({
        name: therapist.name,
        title: therapist.title || '',
        description: therapist.description || '',
        gender: therapist.gender || '',
        tags: therapist.tags?.join(', ') || '',
        photo: therapist.photo || '',
        userId: therapist.userId || '',
      });
    }
  }, [therapist, form]);

  const onSubmit = async (values: TherapistFormValues) => {
    const data: UpdateTherapistRequest = {
      name: values.name,
      title: values.title || undefined,
      description: values.description || undefined,
      gender: values.gender as UpdateTherapistRequest['gender'],
      tags: values.tags ? values.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      photo: values.photo || undefined,
      userId: values.userId || undefined,
    };
    await updateTherapist.mutateAsync({ id, data });
    router.push(`/admin/therapists/${id}`);
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Therapist" backHref="/admin/therapists" />
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
        <PageHeader title="Edit Therapist" backHref="/admin/therapists" />
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

  if (error || !therapist) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Therapist" backHref="/admin/therapists" />
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load therapist details. The profile may not exist.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Therapist"
        description={`Editing: ${therapist.name}`}
        backHref={`/admin/therapists/${id}`}
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                  onClick={() => router.push(`/admin/therapists/${id}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateTherapist.isPending}>
                  {updateTherapist.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Therapist
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
