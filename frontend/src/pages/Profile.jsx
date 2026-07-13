import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Shield, Calendar, Key, UserCheck } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Profile = () => {
  const { user } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Account Profile</h1>
        <p className="text-sm text-gray-400 mt-1">
          Review your SaaS subscription profile, login details, and account configuration.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Left Column - Card Summary */}
        <div className="space-y-6">
          <Card className="text-center flex flex-col items-center">
            {/* Avatar Glow */}
            <div className="relative mt-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-3xl shadow-xl ring-4 ring-violet-500/10">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-[#0c101f] flex items-center justify-center" title="Active">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </span>
            </div>

            <div className="mt-5 space-y-1">
              <h3 className="text-xl font-bold text-gray-100">{user?.full_name || 'Developer'}</h3>
              <p className="text-sm text-gray-400 font-medium">{user?.email}</p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 justify-center mt-5">
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-violet-950/40 text-violet-400 border border-violet-500/20">
                <Shield className="w-3.5 h-3.5" />
                <span>Developer Tier</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Active Account</span>
              </span>
            </div>

            {/* Timestamps */}
            <div className="w-full mt-6 pt-6 border-t border-gray-800/50 text-left space-y-3.5 text-xs text-gray-400 font-semibold">
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Registered: {formatDate(user?.created_at)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-violet-400 shrink-0" />
                <span>ID: {user?.id ? `#${user.id.toString().padStart(4, '0')}` : '#0000'}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Columns - Forms */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Profile Form */}
          <Card>
            <h2 className="text-lg font-bold text-white mb-5">Profile Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="full_name"
                defaultValue={user?.full_name}
                icon={User}
                disabled
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                defaultValue={user?.email}
                icon={Mail}
                disabled
              />
            </div>
            
            <div className="flex justify-end mt-6">
              <Button size="md" disabled>
                Update Information
              </Button>
            </div>
          </Card>

          {/* Password Reset Form */}
          <Card>
            <h2 className="text-lg font-bold text-white mb-5">Change Password</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Current Password"
                name="current_password"
                type="password"
                placeholder="••••••••"
                icon={Key}
                disabled
              />
              <Input
                label="New Password"
                name="new_password"
                type="password"
                placeholder="••••••••"
                icon={Key}
                disabled
              />
            </div>
            
            <div className="flex justify-end mt-6">
              <Button size="md" variant="outline" disabled>
                Update Password
              </Button>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Profile;
