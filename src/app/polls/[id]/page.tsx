import { PollView } from "@/components/PollView";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PollPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <PollView pollId={id} />
    </main>
  );
}
