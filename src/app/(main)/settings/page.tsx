'use client';

import { useAuth } from '@/hooks/use-auth';
import {
  Loader2,
  Bell,
  Shield,
  Eye,
  Globe,
  Save,
  Mail,
  Lock,
  User,
  Palette,
  Languages,
  Download,
  Trash2,
  Key,
  Database,
  Zap,
  RefreshCw,
  CreditCard,
  LogOut,
  Moon,
  Sun,
  Monitor,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase/client';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [storageUsed, setStorageUsed] = useState(0);
  const [isLoadingStorage, setIsLoadingStorage] = useState(true);

  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    emailAnalysisComplete: true,
    emailWeeklyReport: false,
    emailMarketing: false,
    pushNotifications: false,
    pushAnalysisComplete: true,

    // Privacy & Security
    publicProfile: false,
    showEmail: false,
    twoFactorAuth: false,
    analyticsTracking: true,
    shareAnalytics: false,
    dataRetention: '90', // days

    // Appearance
    theme: 'system',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

    // Account
    displayName: user?.displayName || '',
    email: user?.email || '',

    // API & Integrations
    apiEnabled: false,
    webhookUrl: '',
    rateLimit: '100',

    // Data Management
    autoDelete: false,
    autoDeleteDays: '30',
    exportFormat: 'json'
  });

  // Load storage usage
  useEffect(() => {
    const fetchStorageUsage = async () => {
      if (!user) return;

      try {
        setIsLoadingStorage(true);
        const analysesQuery = query(
          collection(db, 'analyses'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(analysesQuery);
        // Rough estimate: ~50KB per analysis
        const estimatedSize = (snapshot.size * 50) / 1024; // MB
        setStorageUsed(estimatedSize);
      } catch (error) {
        console.error('Error fetching storage:', error);
      } finally {
        setIsLoadingStorage(false);
      }
    };

    if (user) {
      fetchStorageUsage();
      setSettings(prev => ({
        ...prev,
        displayName: user.displayName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real app, save to Firestore or backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasUnsavedChanges(false);
      toast({
        title: 'Settings Saved',
        description: 'Your preferences have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setHasUnsavedChanges(true);
  };

  const updateSetting = (key: keyof typeof settings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleDownloadData = () => {
    toast({
      title: 'Download Started',
      description: 'Your data export will be available shortly',
    });
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast({
        title: 'Account Deletion',
        description: 'Please contact support to delete your account',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-bg-canvas">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg-canvas relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-slate-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-5xl px-4 pt-24 pb-12 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-fg-default tracking-tight mb-2">Settings</h1>
              <p className="text-lg text-fg-muted">Customize your workspace and preferences</p>
            </div>

            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <Badge variant="outline" className="animate-pulse border-amber-500/50 text-amber-600 bg-amber-500/10">
                  Unsaved Changes
                </Badge>
              )}
              <Button
                onClick={handleSave}
                disabled={isSaving || !hasUnsavedChanges}
                className="bg-emerald-600 hover:bg-emerald-500 text-white min-w-[140px] shadow-lg shadow-emerald-500/20"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation (Visual Only for now, could be sticky) */}
            <div className="lg:col-span-3 space-y-2">
              <div className="sticky top-24 space-y-1">
                {[
                  { label: 'Account', icon: User, active: true },
                  { label: 'Notifications', icon: Bell },
                  { label: 'Privacy', icon: Shield },
                  { label: 'Appearance', icon: Palette },
                  { label: 'Integrations', icon: Zap },
                  { label: 'Data', icon: Database },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                      item.active
                        ? "bg-bg-surface border border-border-default/50 shadow-sm text-fg-default"
                        : "text-fg-muted hover:bg-bg-surface/50 hover:text-fg-default"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", item.active ? "text-emerald-500" : "opacity-70")} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-6">

              {/* Account Section */}
              <Card className="p-6 border-border-default/40 bg-bg-surface/40 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-fg-default">Account</h2>
                    <p className="text-sm text-fg-muted">Manage your personal information</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-fg-default">Display Name</label>
                      <input
                        type="text"
                        value={settings.displayName}
                        onChange={(e) => updateSetting('displayName', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border-default/50 bg-bg-canvas/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-fg-default">Email Address</label>
                      <input
                        type="email"
                        value={settings.email}
                        disabled
                        className="w-full px-4 py-2.5 rounded-xl border border-border-default/50 bg-bg-canvas/30 text-fg-muted cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border-default/30 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-fg-default">Password</p>
                      <p className="text-sm text-fg-muted">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Key className="w-4 h-4 mr-2" /> Change Password
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Notifications Section */}
              <Card className="p-6 border-border-default/40 bg-bg-surface/40 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-fg-default">Notifications</h2>
                    <p className="text-sm text-fg-muted">Choose how we communicate with you</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-fg-default">Email Notifications</p>
                      <p className="text-sm text-fg-muted">Receive updates via email</p>
                    </div>
                    <div
                      onClick={() => toggleSetting('emailNotifications')}
                      className={cn(
                        "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300",
                        settings.emailNotifications ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300",
                        settings.emailNotifications ? "translate-x-6" : "translate-x-0"
                      )} />
                    </div>
                  </div>

                  {settings.emailNotifications && (
                    <div className="pl-4 space-y-4 border-l-2 border-border-default/50 ml-2">
                      {[
                        { key: 'emailAnalysisComplete', label: 'Analysis Complete', desc: 'When your post analysis is ready' },
                        { key: 'emailWeeklyReport', label: 'Weekly Reports', desc: 'Summary of your performance' },
                        { key: 'emailMarketing', label: 'Product Updates', desc: 'New features and tips' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-fg-default">{item.label}</p>
                            <p className="text-xs text-fg-muted">{item.desc}</p>
                          </div>
                          <div
                            onClick={() => toggleSetting(item.key as keyof typeof settings)}
                            className={cn(
                              "w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-300",
                              settings[item.key as keyof typeof settings] ? "bg-purple-500" : "bg-gray-200 dark:bg-gray-700"
                            )}
                          >
                            <div className={cn(
                              "w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300",
                              settings[item.key as keyof typeof settings] ? "translate-x-5" : "translate-x-0"
                            )} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Privacy & Appearance (Grid) */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border-border-default/40 bg-bg-surface/40 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold text-fg-default">Privacy</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-fg-default">Public Profile</span>
                      <div
                        onClick={() => toggleSetting('publicProfile')}
                        className={cn(
                          "w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-300",
                          settings.publicProfile ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"
                        )}
                      >
                        <div className={cn(
                          "w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300",
                          settings.publicProfile ? "translate-x-5" : "translate-x-0"
                        )} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-fg-default">2FA Security</span>
                      <div
                        onClick={() => toggleSetting('twoFactorAuth')}
                        className={cn(
                          "w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-300",
                          settings.twoFactorAuth ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"
                        )}
                      >
                        <div className={cn(
                          "w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300",
                          settings.twoFactorAuth ? "translate-x-5" : "translate-x-0"
                        )} />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-border-default/40 bg-bg-surface/40 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Palette className="w-5 h-5 text-orange-500" />
                    <h3 className="font-bold text-fg-default">Appearance</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex bg-bg-canvas p-1 rounded-xl border border-border-default/30">
                      {['light', 'system', 'dark'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => updateSetting('theme', theme)}
                          className={cn(
                            "flex-1 py-1.5 rounded-lg text-sm font-medium transition-all flex justify-center items-center gap-2",
                            settings.theme === theme
                              ? "bg-bg-surface shadow-sm text-fg-default"
                              : "text-fg-muted hover:text-fg-default"
                          )}
                        >
                          {theme === 'light' && <Sun className="w-3 h-3" />}
                          {theme === 'dark' && <Moon className="w-3 h-3" />}
                          {theme === 'system' && <Monitor className="w-3 h-3" />}
                          <span className="capitalize">{theme}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* API & Integrations */}
              <Card className="p-6 border-border-default/40 bg-bg-surface/40 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-fg-default">API Access</h2>
                      <p className="text-sm text-fg-muted">Developer settings and webhooks</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                    Pro Feature
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-border-default/40 bg-bg-canvas/30">
                  <div>
                    <p className="font-medium text-fg-default">Enable API</p>
                    <p className="text-xs text-fg-muted">Allow external access to your data</p>
                  </div>
                  <div
                    onClick={() => toggleSetting('apiEnabled')}
                    className={cn(
                      "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300",
                      settings.apiEnabled ? "bg-amber-500" : "bg-gray-200 dark:bg-gray-700"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300",
                      settings.apiEnabled ? "translate-x-6" : "translate-x-0"
                    )} />
                  </div>
                </div>

                {settings.apiEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 space-y-4 pl-4 border-l-2 border-amber-500/20"
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-fg-muted uppercase">Webhook URL</label>
                      <input
                        type="url"
                        value={settings.webhookUrl}
                        onChange={(e) => updateSetting('webhookUrl', e.target.value)}
                        placeholder="https://api.yourapp.com/webhooks"
                        className="w-full px-4 py-2 rounded-lg border border-border-default/50 bg-bg-canvas/50 font-mono text-sm"
                      />
                    </div>
                  </motion.div>
                )}
              </Card>

              {/* Danger Zone */}
              <Card className="p-6 border-red-200/50 bg-red-500/5 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-bold">Danger Zone</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-fg-default">Delete Account</p>
                      <p className="text-sm text-fg-muted">Permanently remove your account and all data</p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                      onClick={handleDeleteAccount}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                    </Button>
                  </div>
                </div>
              </Card>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
