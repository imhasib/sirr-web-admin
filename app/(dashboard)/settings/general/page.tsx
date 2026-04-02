'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, AlertCircle, ArrowLeft, Check, X, Pencil } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSettings, useUpdateSetting } from '@/hooks/use-settings';
import { RequireAdmin } from '@/components/auth';
import { formatDateTime } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { Setting } from '@/types';

interface EditingState {
  [key: string]: {
    value: string;
    description: string;
  };
}

export default function GeneralSettingsPage() {
  const router = useRouter();
  const { data: settings, isLoading, error: settingsError } = useSettings();
  const updateMutation = useUpdateSetting();

  const [editing, setEditing] = useState<{ [key: string]: boolean }>({});
  const [editValues, setEditValues] = useState<EditingState>({});

  // Filter only general settings
  const generalSettings = settings?.filter((s) => s.category === 'general') || [];

  const startEditing = (setting: Setting) => {
    setEditing({ ...editing, [setting.key]: true });
    setEditValues({
      ...editValues,
      [setting.key]: {
        value: setting.value,
        description: setting.description || '',
      },
    });
  };

  const cancelEditing = (key: string) => {
    const newEditing = { ...editing };
    delete newEditing[key];
    setEditing(newEditing);

    const newEditValues = { ...editValues };
    delete newEditValues[key];
    setEditValues(newEditValues);
  };

  const saveChanges = async (setting: Setting) => {
    const editValue = editValues[setting.key];
    if (!editValue) return;

    try {
      await updateMutation.mutateAsync({
        key: setting.key,
        data: {
          value: editValue.value,
          type: setting.type,
          description: editValue.description || undefined,
        },
      });

      cancelEditing(setting.key);
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  };

  const renderValueInput = (setting: Setting) => {
    const editValue = editValues[setting.key];
    if (!editValue) return null;

    const commonClasses = "h-9 text-sm";

    switch (setting.type) {
      case 'number':
        return (
          <Input
            type="number"
            value={editValue.value}
            onChange={(e) =>
              setEditValues({
                ...editValues,
                [setting.key]: { ...editValue, value: e.target.value },
              })
            }
            className={commonClasses}
          />
        );
      case 'boolean':
        return (
          <select
            value={editValue.value}
            onChange={(e) =>
              setEditValues({
                ...editValues,
                [setting.key]: { ...editValue, value: e.target.value },
              })
            }
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );
      case 'text':
        return (
          <Textarea
            value={editValue.value}
            onChange={(e) =>
              setEditValues({
                ...editValues,
                [setting.key]: { ...editValue, value: e.target.value },
              })
            }
            className="min-h-[60px] text-sm resize-y"
          />
        );
      case 'json':
        return (
          <Textarea
            value={editValue.value}
            onChange={(e) =>
              setEditValues({
                ...editValues,
                [setting.key]: { ...editValue, value: e.target.value },
              })
            }
            className="min-h-[60px] font-mono text-sm resize-y"
          />
        );
      default:
        return (
          <Input
            type="text"
            value={editValue.value}
            onChange={(e) =>
              setEditValues({
                ...editValues,
                [setting.key]: { ...editValue, value: e.target.value },
              })
            }
            className={commonClasses}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <RequireAdmin
        pageTitle="General Settings"
        pageDescription="Manage general application settings"
      >
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.SETTINGS)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">General Settings</h1>
            <p className="text-muted-foreground">Manage general application settings</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </RequireAdmin>
    );
  }

  if (settingsError) {
    return (
      <RequireAdmin
        pageTitle="General Settings"
        pageDescription="Manage general application settings"
      >
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.SETTINGS)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">General Settings</h1>
            <p className="text-muted-foreground">Manage general application settings</p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load general settings. Please try again later.
          </AlertDescription>
        </Alert>
      </RequireAdmin>
    );
  }

  return (
    <RequireAdmin
      pageTitle="General Settings"
      pageDescription="Manage general application settings"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.SETTINGS)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-muted-foreground" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">General Settings</h1>
              <p className="text-muted-foreground">Configure application parameters</p>
            </div>
          </div>
        </div>

        {generalSettings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Settings className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No general settings found</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>
                Update configuration values directly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generalSettings.map((setting, index) => (
                <div key={setting._id}>
                  {index > 0 && <div className="border-t my-4" />}

                  {/* Single Row Layout */}
                  <div className="flex items-start gap-4">
                    {/* Left: Key with Details */}
                    <div className="flex-1 min-w-[300px]">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{setting.label}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {setting.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {setting.description || 'No description available'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">{setting.key}</code>
                        <span>•</span>
                        <span>{formatDateTime(setting.updatedAt)}</span>
                      </div>
                    </div>

                    {/* Middle: Input Field */}
                    <div className="w-80 flex-shrink-0 pt-1">
                      {editing[setting.key] ? (
                        renderValueInput(setting)
                      ) : (
                        <div
                          className="px-3 py-2 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => startEditing(setting)}
                        >
                          <code className="text-sm">{setting.value}</code>
                        </div>
                      )}
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex gap-1 flex-shrink-0 pt-1">
                      {editing[setting.key] ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => saveChanges(setting)}
                            disabled={updateMutation.isPending}
                            title="Save"
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => cancelEditing(setting.key)}
                            disabled={updateMutation.isPending}
                            title="Cancel"
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => startEditing(setting)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </RequireAdmin>
  );
}
