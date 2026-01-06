import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Bell,
  Globe,
  Shield,
  Trash2,
  LogOut,
  User,
  Palette,
  Volume2,
  Eye,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: {
      quizReminders: true,
      achievementAlerts: true,
      weeklyProgress: true,
      emailUpdates: false,
    },
    language: 'English',
    accessibility: {
      reduceMotion: false,
      highContrast: false,
      soundEffects: true,
    }
  });

  const updateNotification = (key: keyof typeof settings.notifications) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
    saveSettings();
  };

  const updateAccessibility = (key: keyof typeof settings.accessibility) => {
    setSettings({
      ...settings,
      accessibility: {
        ...settings.accessibility,
        [key]: !settings.accessibility[key],
      },
    });
    saveSettings();
  };

  const saveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion",
      description: "Please contact support to delete your account",
      variant: "destructive",
    });
  };

  const settingSections = [
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      content: (
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSettings({ ...settings, theme: 'light' })}
            className={`p-4 rounded-xl border-2 transition-all ${settings.theme === 'light'
                ? 'border-primary bg-primary/10'
                : 'border-white/10 hover:border-white/20'
              }`}
          >
            <div className="w-12 h-12 rounded-xl bg-white mx-auto mb-3 flex items-center justify-center">
              <Sun className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="font-medium">Light</p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSettings({ ...settings, theme: 'dark' })}
            className={`p-4 rounded-xl border-2 transition-all ${settings.theme === 'dark'
                ? 'border-primary bg-primary/10'
                : 'border-white/10 hover:border-white/20'
              }`}
          >
            <div className="w-12 h-12 rounded-xl bg-slate-800 mx-auto mb-3 flex items-center justify-center">
              <Moon className="w-6 h-6 text-blue-400" />
            </div>
            <p className="font-medium">Dark</p>
          </motion.button>
        </div>
      )
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      content: (
        <div className="space-y-4">
          {[
            { key: 'quizReminders', label: 'Quiz Reminders', description: 'Get reminded to take your daily quiz' },
            { key: 'achievementAlerts', label: 'Achievement Alerts', description: 'Notifications when you unlock badges' },
            { key: 'weeklyProgress', label: 'Weekly Progress', description: 'Receive weekly learning summary' },
            { key: 'emailUpdates', label: 'Email Updates', description: 'Product updates and tips via email' },
          ].map((item, index) => (
            <motion.div
              key={item.key}
              className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div>
                <Label className="font-medium">{item.label}</Label>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Switch
                checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                onCheckedChange={() => updateNotification(item.key as keyof typeof settings.notifications)}
              />
            </motion.div>
          ))}
        </div>
      )
    },
    {
      id: 'language',
      title: 'Language',
      icon: Globe,
      content: (
        <div className="grid grid-cols-3 gap-3">
          {['English', 'हिंदी', 'Español', 'Français', 'Deutsch', '中文'].map((lang, index) => (
            <motion.button
              key={lang}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSettings({ ...settings, language: lang })}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${settings.language === lang
                  ? 'bg-primary/20 border-2 border-primary text-primary'
                  : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10'
                }`}
            >
              {lang}
            </motion.button>
          ))}
        </div>
      )
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      icon: Eye,
      content: (
        <div className="space-y-4">
          {[
            { key: 'reduceMotion', label: 'Reduce Motion', description: 'Minimize animations', icon: Eye },
            { key: 'highContrast', label: 'High Contrast', description: 'Increase text visibility', icon: Sun },
            { key: 'soundEffects', label: 'Sound Effects', description: 'Play sounds for actions', icon: Volume2 },
          ].map((item, index) => (
            <motion.div
              key={item.key}
              className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label className="font-medium">{item.label}</Label>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <Switch
                checked={settings.accessibility[item.key as keyof typeof settings.accessibility]}
                onCheckedChange={() => updateAccessibility(item.key as keyof typeof settings.accessibility)}
              />
            </motion.div>
          ))}
        </div>
      )
    },
    {
      id: 'account',
      title: 'Account',
      icon: Shield,
      content: (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white/5 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">{user?.name || 'User'}</p>
                <p className="text-sm text-muted-foreground">{user?.email || 'email@example.com'}</p>
              </div>
            </div>
          </div>

          <Button variant="ghost" className="w-full justify-start h-12">
            <Shield className="w-4 h-4 mr-3" />
            Change Password
          </Button>
          <Button variant="ghost" className="w-full justify-start h-12 text-warning hover:text-warning" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
          <Button variant="ghost" className="w-full justify-start h-12 text-destructive hover:text-destructive" onClick={handleDeleteAccount}>
            <Trash2 className="w-4 h-4 mr-3" />
            Delete Account
          </Button>
        </div>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <motion.div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted to-muted-foreground mx-auto mb-6 flex items-center justify-center"
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <SettingsIcon className="w-8 h-8 text-primary-foreground" />
              </motion.div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Settings
              </h1>
              <p className="text-muted-foreground">
                Customize your learning experience
              </p>
            </motion.div>

            {/* Settings Sections */}
            {settingSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="glass-card p-6 mb-6"
              >
                <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <section.icon className="w-5 h-5 text-primary" />
                  {section.title}
                </h2>
                {section.content}
              </motion.div>
            ))}

            {/* Save indicator */}
            {isSaving && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground shadow-lg"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
