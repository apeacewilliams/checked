import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/features/notifications';
import { registerSchema, type RegisterValues } from '../schemas';
import { getFirebaseErrorMessage } from '../utils/firebaseError';
import { AuthLayout } from './AuthLayout';
import { PasswordInput } from './PasswordInput';

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const { showError, showSuccess } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsSubmitting(true);
    try {
      await registerUser(data.email, data.password, data.displayName);
      showSuccess('Account created successfully!');
    } catch (error) {
      showError(getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout heading="Sign up to" subheading="get things done ✨">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid gap-2">
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

        <div className="grid gap-2">
          <Label htmlFor="displayName">Enter your user name</Label>
          <Input
            id="displayName"
            type="text"
            placeholder="task master"
            aria-invalid={Boolean(errors.displayName)}
            {...register('displayName')}
          />
          {errors.displayName && (
            <p className="text-sm text-destructive">{errors.displayName.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Enter your password</Label>
          <PasswordInput
            id="password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm your password</Label>
          <PasswordInput
            id="confirmPassword"
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Register'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an Account?{' '}
          <a href="/login" className="font-semibold text-primary hover:underline">
            Login
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
