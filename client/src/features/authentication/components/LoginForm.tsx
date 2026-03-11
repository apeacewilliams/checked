import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/features/notifications';
import { loginSchema, type LoginValues } from '../schemas';
import { getFirebaseErrorMessage } from '../utils/firebaseError';
import { AuthLayout } from './AuthLayout';
import { PasswordInput } from './PasswordInput';

export function LoginForm() {
  const { login, resetPassword } = useAuth();
  const { showError, showSuccess } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');

  const onSubmit = async (data: LoginValues) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password, data.rememberMe);
    } catch (error) {
      showError(getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout heading="Sign in to" subheading="get things done ✨">
      <form onSubmit={handleSubmit(onSubmit)} className="grid">
        <div className="grid gap-2 mb-9">
          <Label htmlFor="email">Enter your email</Label>
          <Input
            id="email"
            type="email"
            placeholder="yours@example.com"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="grid gap-2 mb-8">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between mb-9">
          <div className="flex items-center gap-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => setValue('rememberMe', checked === true)}
            />
            <Label htmlFor="rememberMe" className="cursor-pointer">
              Remember me
            </Label>
          </div>
          <button
            type="button"
            className="text-sm text-primary hover:underline font-semibold"
            onClick={async () => {
              const email = getValues('email');
              if (!email) {
                showError('Enter your email first');
                return;
              }
              try {
                await resetPassword(email);
                showSuccess('Password reset email sent!');
              } catch {
                showError('Failed to send reset email. Check your email address.');
              }
            }}
          >
            Forgot Password?
          </button>
        </div>

        <Button type="submit" size="lg" className="w-full mb-4" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Login'}
        </Button>

        <p className="text-center text-sm text-muted-foreground mb-6">
          Don&apos;t have an Account?{' '}
          <a href="/register" className="font-semibold text-primary hover:underline">
            Register
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
