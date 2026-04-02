'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Setting } from '@/types';
import { useUpdateSetting } from '@/hooks/use-settings';
import { formatDateTime } from '@/lib/utils';

interface EditSettingDialogProps {
  setting: Setting | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  outputSchema?: string;
}

export function EditSettingDialog({ setting, open, onOpenChange, outputSchema }: EditSettingDialogProps) {
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const updateSetting = useUpdateSetting();

  // Reset form when setting changes
  useEffect(() => {
    if (setting) {
      setValue(setting.value);
      setDescription(setting.description || '');
    }
  }, [setting]);

  const handleSave = () => {
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    if (!setting) return;

    try {
      await updateSetting.mutateAsync({
        key: setting.key,
        data: {
          value,
          description: description || undefined,
        },
      });
      setShowConfirm(false);
      onOpenChange(false);
    } catch {
      // Error handled in hook
      setShowConfirm(false);
    }
  };

  const hasChanges = setting && (value !== setting.value || description !== (setting.description || ''));

  if (!setting) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {setting.label}</DialogTitle>
            <DialogDescription>
              Last updated: {formatDateTime(setting.updatedAt)}
            </DialogDescription>
          </DialogHeader>

          <Alert variant="warning" className="my-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              The output format is automatically appended. Only edit the behavior/tone instructions.
            </AlertDescription>
          </Alert>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="value">Prompt Content</Label>
                <span className="text-xs text-muted-foreground">
                  {value.length.toLocaleString()} characters
                </span>
              </div>
              <Textarea
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="min-h-[400px] font-mono text-sm resize-y"
                placeholder="Enter prompt content..."
              />
            </div>

            {outputSchema ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Output Schema (Reference)</Label>
                  <span className="text-xs text-muted-foreground">
                    {outputSchema.length.toLocaleString()} characters
                  </span>
                </div>
                <Textarea
                  value={outputSchema}
                  readOnly
                  className="min-h-[150px] max-h-[200px] font-mono text-sm bg-muted/50 cursor-default"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this setting..."
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || updateSetting.isPending}
            >
              {updateSetting.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this prompt? This change will affect how the system behaves.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave}>
              {updateSetting.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Prompt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
