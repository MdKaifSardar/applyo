import { CreatePollForm } from "@/components/CreatePollForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Poll Rooms</h1>
        <p className="text-gray-600">
          Create a real-time poll and share it instantly.
        </p>
      </div>

      <CreatePollForm />

      <footer className="mt-12 text-sm text-gray-400">
        <p>Anonymous • Real-time • Simple</p>
      </footer>
    </main>
  );
}
