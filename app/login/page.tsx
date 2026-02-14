'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/store/auth-store';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);

    try {
       const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log(response);
      if (response.ok) {
        const result = await response.json();
        if (result.code === "success") {
          const { setAccessToken } = useAuthStore.getState();
          setAccessToken(result.data.accessToken);
          alert("token is: " + result.data.accessToken);
          window.location.href = '/';
        } else {
          setError(result.message || 'Login failed');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      <Card className="w-full max-w-md backdrop-blur-md bg-card/80 border border-primary/50">
        <CardHeader className="text-center">
          <CardTitle className="text-primary text-3xl font-bold tracking-wider">LOG IN</CardTitle>
          <CardDescription className="text-muted-foreground">Access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-accent font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="border-border focus:border-primary text-black"
                style={{ backgroundColor: 'white' }}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-destructive text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-accent font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="border-border focus:border-primary text-black"
                style={{ backgroundColor: 'white' }}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-destructive text-sm">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="border-destructive/50">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3"
              disabled={isLoading}
            >
              {isLoading ? 'AUTHENTICATING...' : 'LOG IN'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{' '}
              <a 
                href="/register" 
                className="text-accent hover:text-accent/80 underline decoration-accent/50 hover:decoration-accent transition-colors font-medium"
              >
                Sign up
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
