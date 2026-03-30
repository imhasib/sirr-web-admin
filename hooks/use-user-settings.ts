import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { accountService } from '@/services/account.service';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth-store';
import { UpdateProfileData, ChangePasswordData } from '@/types';

/**
 * Hook for updating user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => accountService.updateProfile(data),
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
}

/**
 * Hook for changing user password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => authService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to change password');
    },
  });
}
