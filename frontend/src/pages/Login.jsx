import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, LogIn } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      // Errors are handled and toasted inside AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-extrabold text-white">Welcome Back</h1>
        <p className="text-sm text-gray-400">
          Enter your credentials to access your code reviewer dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-800 bg-gray-900 text-violet-600 focus:ring-violet-500/20 focus:ring-offset-0 focus:outline-none"
              {...register('rememberMe')}
            />
            <span>Remember Me</span>
          </label>
          <a href="#forgot" className="text-violet-400 hover:text-violet-300 transition">
            Forgot Password?
          </a>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={submitting}
          icon={LogIn}
        >
          Sign In
        </Button>
      </form>

      {/* Redirect link */}
      <p className="text-xs text-center text-gray-400 font-semibold mt-4">
        Don&apos;t have an account yet?{' '}
        <Link to="/register" className="text-violet-400 hover:text-violet-300 transition font-bold">
          Register Here
        </Link>
      </p>
    </div>
  );
};

export default Login;
