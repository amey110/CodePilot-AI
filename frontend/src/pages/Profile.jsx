import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Shield, Calendar, Key, UserCheck, Loader2 } from 'lucide-react';
import { Card, Input, Button } from '../components/ui';
import { toast } from 'react-hot-toast';
import { userService } from '../services';

const Profile = () => {
  const { user, refreshUser } = useAuth();

  // Profile update state
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (user?.full_name) {
      setFullName(user.full_name);
    }
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Full name cannot be empty.');
      return;
    }

    setUpdatingProfile(true);
    try {
      await userService.updateProfile({ full_name: fullName.trim() });
      toast.success('Profile updated successfully!');
      if (refreshUser) {
        await refreshUser();
      }
    } catch (err) {
      console.error('Update profile failed:', err);
      toast.error(err.response?.data?.detail || err.message || 'Failed to update profile.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      await userService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Change password failed:', err);
      toast.error(err.response?.data?.detail || err.message || 'Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
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
            <form onSubmit={handleUpdateProfile}>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="full_name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  icon={User}
                  placeholder="e.g. Jane Doe"
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  defaultValue={user?.email}
                  icon={Mail}
                  disabled
                  helperText="Email cannot be changed."
                />
              </div>
              
              <div className="flex justify-end mt-6">
                <Button 
                  size="md" 
                  type="submit" 
                  disabled={updatingProfile}
                  className="cursor-pointer"
                >
                  {updatingProfile ? (
                    <span className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </span>
                  ) : (
                    'Update Information'
                  )}
                </Button>
              </div>
            </form>
          </Card>

          {/* Password Reset Form */}
          <Card>
            <h2 className="text-lg font-bold text-white mb-5">Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Current Password"
                    name="current_password"
                    type="password"
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    icon={Key}
                    required
                  />
                </div>
                <Input
                  label="New Password"
                  name="new_password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  icon={Key}
                  required
                />
                <Input
                  label="Confirm New Password"
                  name="confirm_password"
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={Key}
                  required
                />
              </div>
              
              <div className="flex justify-end mt-6">
                <Button 
                  size="md" 
                  variant="outline" 
                  type="submit"
                  disabled={changingPassword}
                  className="cursor-pointer"
                >
                  {changingPassword ? (
                    <span className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Changing Password...</span>
                    </span>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
