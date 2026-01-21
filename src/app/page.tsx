'use client';

import { LandingPage } from '@/components/landing-page';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-bg-canvas">
                <Loader2 className="h-12 w-12 animate-spin text-teal-500" />
            </div>
        );
    }

    // If user is logged in, show loader while redirecting to avoid flashing landing page
    if (user) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-bg-canvas">
                <Loader2 className="h-12 w-12 animate-spin text-teal-500" />
            </div>
        );
    }

    return <LandingPage />;
}
