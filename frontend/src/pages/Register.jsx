import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { Input, Button } from '../components/ui';

const Register = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await signup(data.fullName, data.email, data.password, data.confirmPassword);
      navigate('/login');
    } catch (err) {
      // Errors are handled and toasted inside AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-extrabold text-white">Create Account</h1>
        <p className="text-sm text-gray-400">
          Get started by setting up your cloud reviewer profile details.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name Input */}
        <Input
          label="Full Name"
          name="fullName"
          placeholder="John Doe"
          icon={User}
          error={errors.fullName}
          {...register('fullName', {
            required: 'Full name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters'
            }
          })}
        />

        {/* Email Input */}
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="developer@example.com"
          icon={Mail}
          error={errors.email}
          {...register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />

        {/* Password Input */}
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.password}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            }
          })}
        />

        {/* Confirm Password Input */}
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.confirmPassword}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === passwordValue || 'Passwords do not match'
          })}
        />

        {/* Register Button */}
        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={submitting}
          icon={UserPlus}
        >
          Create Profile
        </Button>
      </form>

      {/* Redirect link */}
      <p className="text-xs text-center text-gray-400 font-semibold mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-violet-400 hover:text-violet-300 transition font-bold">
          Sign In Here
        </Link>
      </p>
    </div>
  );
};

export default Register;
