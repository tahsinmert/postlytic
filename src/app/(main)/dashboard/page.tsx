'use client';

import { AnalysisDashboard } from '@/components/analysis-dashboard';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Protect the route
    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
            </div>
        );
    }

    // If not logged in, we render nothing while redirecting (or could show a message)
    if (!user) return null;

    return <AnalysisDashboard />;
}
