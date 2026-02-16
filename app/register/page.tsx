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
import { GoogleLogin } from '@react-oauth/google';
import { handleGoogleAuth } from '@/lib/utils';

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BE_API}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log(response);
      if (response.ok) {
        setSuccess(true);
        window.location.href = '/login';
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
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
          <CardTitle className="text-primary text-3xl font-bold tracking-wider">SIGN UP</CardTitle>
          <CardDescription className="text-muted-foreground">Join the digital realm</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-accent font-medium">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="border-border focus:border-primary text-black"
                style={{ backgroundColor: 'white' }}
                {...register('username')}
              />
              {errors.username && (
                <p className="text-destructive text-sm">{errors.username.message}</p>
              )}
            </div>

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

            {success && (
              <Alert className="border-primary/50 bg-primary/10">
                <AlertDescription className="text-primary">
                  Registration successful! Redirecting...
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3"
              disabled={isLoading}
            >
              {isLoading ? 'INITIALIZING...' : 'SIGN UP'}
            </Button>
          </form>

          <div className="mt-4 flex items-center">
            <div className="flex-1 border-t border-border"></div>
            <span className="px-2 text-muted-foreground text-sm">or</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          <div className="mt-4">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                handleGoogleAuth(credentialResponse);
              }}
              onError={() => {
                console.log('Signup Failed');
              }}
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{' '}
              <a 
                href="/login" 
                className="text-accent hover:text-accent/80 underline decoration-accent/50 hover:decoration-accent transition-colors font-medium"
              >
                Log in
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
