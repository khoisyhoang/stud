import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useAuthStore } from '@/store/auth-store'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function handleGoogleAuth(credentialResponse: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BE_API}/auth/google/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: credentialResponse.credential,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.code === "success") {
        const { setAccessToken } = useAuthStore.getState();
        setAccessToken(result.data.accessToken);
        window.location.href = '/';
      } else {
        console.error('Google auth failed:', result.message);
        alert('Google authentication failed: ' + (result.message || 'Unknown error'));
      }
    } else {
      const errorData = await response.json();
      console.error('Google auth error:', errorData);
      alert('Google authentication failed: ' + (errorData.message || 'Unknown error'));
    }
  } catch (err) {
    console.error('Network error during Google auth:', err);
    alert('Network error during Google authentication. Please check if the server is running.');
  }
}
