'use client';

import { useRouter } from 'next/navigation';
import { Settings, MessageSquareText, AlertCircle, ChevronRight, User, KeyRound } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuthStore } from '@/stores/auth-store';
import { ROUTES } from '@/lib/constants';

interface SettingCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const USER_SETTING_CATEGORIES: SettingCategory[] = [
  {
    id: 'profile',
    title: 'Profile',
    description: 'Manage your personal information and account details',
    icon: <User className="h-6 w-6" />,
    href: ROUTES.PROFILE_SETTINGS,
  },
  {
    id: 'password',
    title: 'Change Password',
    description: 'Update your account password to keep it secure',
    icon: <KeyRound className="h-6 w-6" />,
    href: ROUTES.PASSWORD_SETTINGS,
  },
];

const ADMIN_SETTING_CATEGORIES: SettingCategory[] = [
  {
    id: 'prompts',
    title: 'Prompt Settings',
    description: 'Manage system prompts and their output schemas for AI interactions',
    icon: <MessageSquareText className="h-6 w-6" />,
    href: ROUTES.PROMPT_SETTINGS,
  },
  // Future categories can be added here:
  // {
  //   id: 'general',
  //   title: 'General Settings',
  //   description: 'Configure general application settings',
  //   icon: <Cog className="h-6 w-6" />,
  //   href: ROUTES.GENERAL_SETTINGS,
  // },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-muted-foreground" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account and system configurations</p>
        </div>
      </div>

      {/* User Settings - Available to all users */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Account Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your personal account settings</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {USER_SETTING_CATEGORIES.map((category) => (
            <Card
              key={category.id}
              className="hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => router.push(category.href)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                    {category.icon}
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Admin Settings - Only for admins */}
      {isAdmin && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">System Settings</h2>
            <p className="text-sm text-muted-foreground">Configure system-wide settings and preferences</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ADMIN_SETTING_CATEGORIES.map((category) => (
              <Card
                key={category.id}
                className="hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => router.push(category.href)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                      {category.icon}
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
