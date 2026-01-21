import { PublicResultView } from '@/components/public-result-view';
import { notFound } from 'next/navigation';

export const revalidate = 3600; // Revalidate every hour

// This page now passes the ID to a client component to fetch data.
// This avoids needing firebase-admin for SSR.
export default function PublicResultPage({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id) {
    notFound();
  }

  return <PublicResultView id={params.id} />;
}
